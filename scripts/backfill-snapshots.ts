import { createAdminClient } from "@/lib/supabase/admin";
import { computeWeightedAverage } from "@/lib/services/price-aggregator";
import { logger } from "@/lib/utils/logger";
import type { Database } from "@/lib/types/database";

type AdminClient = ReturnType<typeof createAdminClient>;
type SetPriceRow = Database["public"]["Tables"]["set_prices"]["Row"];
type CondItem = {
  set_id: string;
  condition: "new" | "used";
  purchase_price: number | null;
  theme_name: string;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DEFAULT_INTERVAL_DAYS = 7;

interface BackfillOptions {
  userIds?: string[];
  intervalDays?: number;
  maxDays?: number;
}

async function fetchUserHoldings(
  supabase: AdminClient,
  userId: string,
): Promise<CondItem[]> {
  const { data, error } = await supabase
    .from("collection_items")
    .select(
      "set_id, condition, purchase_price, sets!inner(themes(name)), collections!inner(user_id)",
    )
    .eq("collections.user_id", userId);

  if (error) throw error;

  return (data ?? []).map((row) => {
    const sets = row.sets as unknown as {
      themes: { name: string } | null;
    } | null;
    return {
      set_id: row.set_id,
      condition: row.condition,
      purchase_price: row.purchase_price,
      theme_name: sets?.themes?.name ?? "Other",
    };
  });
}

async function fetchPricesForSets(
  supabase: AdminClient,
  setIds: string[],
): Promise<Map<string, SetPriceRow[]>> {
  const byId = new Map<string, SetPriceRow[]>();
  if (setIds.length === 0) return byId;

  const CHUNK = 200;
  for (let i = 0; i < setIds.length; i += CHUNK) {
    const chunk = setIds.slice(i, i + CHUNK);
    const { data, error } = await supabase
      .from("set_prices")
      .select("*")
      .in("set_id", chunk)
      .order("fetched_at", { ascending: true });
    if (error) throw error;
    for (const row of (data ?? []) as SetPriceRow[]) {
      const arr = byId.get(row.set_id) ?? [];
      arr.push(row);
      byId.set(row.set_id, arr);
    }
  }
  return byId;
}

function valueAsOf(
  prices: SetPriceRow[],
  asOfMs: number,
  condition: "new" | "used",
): number | null {
  const bySource = new Map<string, SetPriceRow>();
  for (const p of prices) {
    const ms = new Date(p.fetched_at).getTime();
    if (ms > asOfMs) break;
    bySource.set(p.source, p);
  }
  if (bySource.size === 0) return null;

  const points = [...bySource.values()].map((p) => ({
    source: p.source,
    new_avg: p.new_avg,
    used_avg: p.used_avg,
    new_qty_sold: p.new_qty_sold,
  }));
  return computeWeightedAverage(
    points,
    condition === "new" ? "new_avg" : "used_avg",
  );
}

export async function backfillUser(
  supabase: AdminClient,
  userId: string,
  intervalDays: number,
  maxDays: number,
): Promise<number> {
  const holdings = await fetchUserHoldings(supabase, userId);
  if (holdings.length === 0) return 0;

  const setIds = [...new Set(holdings.map((h) => h.set_id))];
  const pricesBySet = await fetchPricesForSets(supabase, setIds);

  let earliest = Infinity;
  for (const rows of pricesBySet.values()) {
    if (rows.length > 0) {
      const ms = new Date(rows[0].fetched_at).getTime();
      if (ms < earliest) earliest = ms;
    }
  }
  if (!isFinite(earliest)) return 0;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const cutoffMs = todayMs - maxDays * MS_PER_DAY;
  const startMs = Math.max(earliest, cutoffMs);

  const rows: Database["public"]["Tables"]["portfolio_snapshots"]["Insert"][] =
    [];
  const costBasis = holdings.reduce((s, h) => s + (h.purchase_price ?? 0), 0);

  for (let tMs = startMs; tMs <= todayMs; tMs += intervalDays * MS_PER_DAY) {
    let totalValue = 0;
    const byTheme: Record<string, number> = {};
    const byCondition: Record<string, number> = { new: 0, used: 0 };

    for (const h of holdings) {
      const prices = pricesBySet.get(h.set_id) ?? [];
      const v = valueAsOf(prices, tMs, h.condition) ?? 0;
      totalValue += v;
      byTheme[h.theme_name] = (byTheme[h.theme_name] ?? 0) + v;
      byCondition[h.condition] = (byCondition[h.condition] ?? 0) + v;
    }

    const snapshotDate = new Date(tMs).toISOString().slice(0, 10);
    rows.push({
      user_id: userId,
      snapshot_date: snapshotDate,
      total_value: round2(totalValue),
      cost_basis: round2(costBasis),
      item_count: holdings.length,
      by_theme_json: roundRecord(byTheme),
      by_condition_json: roundRecord(byCondition),
    });
  }

  if (rows.length === 0) return 0;

  const { error } = await supabase
    .from("portfolio_snapshots")
    .upsert(rows, { onConflict: "user_id,snapshot_date" });
  if (error) throw error;

  return rows.length;
}

export async function backfillSnapshots(
  options: BackfillOptions = {},
): Promise<void> {
  const supabase = createAdminClient();
  const intervalDays = options.intervalDays ?? DEFAULT_INTERVAL_DAYS;
  const maxDays = options.maxDays ?? 365;

  let userIds = options.userIds;
  if (!userIds) {
    const { data, error } = await supabase
      .from("collections")
      .select("user_id, collection_items!inner(id)");
    if (error) throw error;
    userIds = [...new Set((data ?? []).map((r) => r.user_id))];
  }

  logger.info("Starting snapshot backfill", {
    users: userIds.length,
    intervalDays,
    maxDays,
  });

  let total = 0;
  for (const userId of userIds) {
    try {
      const count = await backfillUser(supabase, userId, intervalDays, maxDays);
      total += count;
      logger.info("Backfilled user", { userId, rows: count });
    } catch (err) {
      logger.error("Backfill failed for user", {
        userId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  logger.info("Backfill complete", { users: userIds.length, totalRows: total });
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
function roundRecord(r: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(r)) out[k] = round2(v);
  return out;
}

if (import.meta.filename === process.argv[1]) {
  const intervalArg = process.argv.indexOf("--interval-days");
  const intervalDays =
    intervalArg !== -1 ? parseInt(process.argv[intervalArg + 1], 10) : undefined;

  const maxArg = process.argv.indexOf("--max-days");
  const maxDays =
    maxArg !== -1 ? parseInt(process.argv[maxArg + 1], 10) : undefined;

  backfillSnapshots({ intervalDays, maxDays }).catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  });
}
