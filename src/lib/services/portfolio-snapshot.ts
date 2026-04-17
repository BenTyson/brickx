import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { logger } from "@/lib/utils/logger";

type AdminClient = SupabaseClient<Database>;

export interface PortfolioSnapshotData {
  total_value: number;
  cost_basis: number;
  item_count: number;
  by_theme: Record<string, number>;
  by_condition: Record<string, number>;
}

interface ItemRow {
  condition: "new" | "used";
  purchase_price: number | null;
  set_id: string;
  sets: {
    theme_id: number | null;
    themes: { name: string } | null;
    set_market_values: {
      market_value_new: number | null;
      market_value_used: number | null;
    }[];
  } | null;
}

export async function computeUserSnapshot(
  supabase: AdminClient,
  userId: string,
): Promise<PortfolioSnapshotData> {
  const { data, error } = await supabase
    .from("collection_items")
    .select(
      "condition, purchase_price, set_id, sets!inner(theme_id, themes(name), set_market_values(market_value_new, market_value_used)), collections!inner(user_id)",
    )
    .eq("collections.user_id", userId);

  if (error) {
    logger.error("Failed to load items for snapshot", {
      userId,
      error: error.message,
    });
    throw error;
  }

  const items = (data ?? []) as unknown as ItemRow[];

  let totalValue = 0;
  let costBasis = 0;
  const byTheme: Record<string, number> = {};
  const byCondition: Record<string, number> = { new: 0, used: 0 };

  for (const item of items) {
    const mv = item.sets?.set_market_values?.[0];
    const value =
      item.condition === "new"
        ? (mv?.market_value_new ?? 0)
        : (mv?.market_value_used ?? 0);
    const cost = item.purchase_price ?? 0;
    const themeName = item.sets?.themes?.name ?? "Other";

    totalValue += value;
    costBasis += cost;
    byTheme[themeName] = (byTheme[themeName] ?? 0) + value;
    byCondition[item.condition] = (byCondition[item.condition] ?? 0) + value;
  }

  return {
    total_value: round2(totalValue),
    cost_basis: round2(costBasis),
    item_count: items.length,
    by_theme: roundRecord(byTheme),
    by_condition: roundRecord(byCondition),
  };
}

export async function listUsersWithItems(
  supabase: AdminClient,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("user_id, collection_items!inner(id)");

  if (error) {
    logger.error("Failed to list users with items", { error: error.message });
    throw error;
  }

  const unique = new Set<string>();
  for (const row of data ?? []) unique.add(row.user_id);
  return [...unique];
}

export async function upsertSnapshot(
  supabase: AdminClient,
  userId: string,
  snapshotDate: string,
  snapshot: PortfolioSnapshotData,
): Promise<void> {
  const { error } = await supabase.from("portfolio_snapshots").upsert(
    {
      user_id: userId,
      snapshot_date: snapshotDate,
      total_value: snapshot.total_value,
      cost_basis: snapshot.cost_basis,
      item_count: snapshot.item_count,
      by_theme_json: snapshot.by_theme,
      by_condition_json: snapshot.by_condition,
    },
    { onConflict: "user_id,snapshot_date" },
  );

  if (error) {
    logger.error("Failed to upsert snapshot", {
      userId,
      snapshotDate,
      error: error.message,
    });
    throw error;
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function roundRecord(r: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(r)) out[k] = round2(v);
  return out;
}
