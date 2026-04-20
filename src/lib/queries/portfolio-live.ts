import { createClient } from "@/lib/supabase/server";
import type { CatalogSet, SetStatus } from "@/lib/mock/catalog";
import { sparklineForSet } from "@/lib/mock/catalog";
import type {
  Holding,
  PortfolioSnapshot,
  ThemeAllocation,
  MoverRow,
  WishlistItem,
} from "@/lib/mock/portfolio";
import type { PortfolioSummary } from "@/lib/types/collection";
import { randomWalk } from "@/lib/mock/series";

/**
 * Wire real user holdings into the v2 `Holding` shape.
 * Each collection_item row becomes one Holding with qty=1 (the schema has no
 * quantity column — duplicates are stored as separate rows).
 */
export interface LiveCollection {
  id: string;
  name: string;
}

export interface LivePortfolioData {
  holdings: Holding[];
  collections: LiveCollection[];
}

interface RawItemRow {
  id: string;
  collection_id: string;
  set_id: string;
  condition: "new" | "used";
  purchase_price: number | null;
  purchase_date: string | null;
  created_at: string;
  collections: { id: string; name: string; user_id: string } | null;
  sets:
    | {
        name: string;
        year: number;
        img_url: string | null;
        num_parts: number | null;
        num_minifigs: number | null;
        msrp_usd: number | null;
        status: SetStatus | string;
        themes: { name: string } | null;
        set_market_values: {
          market_value_new: number | null;
          market_value_used: number | null;
          pct_change_30d: number | null;
          pct_change_90d: number | null;
          growth_annual_pct: number | null;
        } | null;
      }
    | null;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapStatus(db: string | null | undefined): CatalogSet["status"] {
  if (db === "retired") return "retired";
  if (db === "unreleased") return "unreleased";
  return "available";
}

function buildCatalogSet(row: RawItemRow): CatalogSet {
  const s = row.sets;
  const mv = s?.set_market_values ?? null;
  const themeName = s?.themes?.name ?? "Other";
  const condition = row.condition;
  const current =
    condition === "new"
      ? (mv?.market_value_new ?? mv?.market_value_used ?? s?.msrp_usd ?? 0)
      : (mv?.market_value_used ?? mv?.market_value_new ?? s?.msrp_usd ?? 0);
  return {
    id: row.set_id,
    name: s?.name ?? "Unknown Set",
    theme: themeName,
    themeSlug: slugify(themeName),
    year: s?.year ?? new Date().getFullYear(),
    status: mapStatus(s?.status as string | undefined),
    imgUrl: s?.img_url ?? null,
    msrp: s?.msrp_usd ?? 0,
    currentValue: Number(current) || 0,
    pctChange30d: Number(mv?.pct_change_30d ?? 0),
    parts: s?.num_parts ?? 0,
    minifigs: s?.num_minifigs ?? 0,
    appreciation: Number(mv?.growth_annual_pct ?? 0),
  };
}

function holdingFromRow(row: RawItemRow): Holding | null {
  if (!row.sets) return null;
  const set = buildCatalogSet(row);
  const annual = row.sets.set_market_values?.growth_annual_pct;
  const delta1y = Number(annual ?? set.pctChange30d * 4);
  return {
    set,
    qty: 1,
    costBasisPerUnit: Number(row.purchase_price ?? 0),
    purchaseDate: (row.purchase_date ?? row.created_at ?? "").slice(0, 10),
    collectionId: row.collection_id,
    sparkline30d: sparklineForSet(set, 30),
    delta30d: set.pctChange30d,
    delta1y,
  };
}

/**
 * Fetch every collection_item the current user owns, joined with set + market
 * data, then map to v2 Holding shape.
 */
export async function fetchLivePortfolioData(): Promise<LivePortfolioData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { holdings: [], collections: [] };

  const { data, error } = await supabase
    .from("collection_items")
    .select(
      "id, collection_id, set_id, condition, purchase_price, purchase_date, created_at, collections!inner(id, name, user_id), sets(name, year, img_url, num_parts, num_minifigs, msrp_usd, status, themes(name), set_market_values(market_value_new, market_value_used, pct_change_30d, pct_change_90d, growth_annual_pct))",
    )
    .eq("collections.user_id", user.id);

  if (error || !data) return { holdings: [], collections: [] };

  const holdings: Holding[] = [];
  const collectionsMap = new Map<string, LiveCollection>();
  for (const row of data as unknown as RawItemRow[]) {
    if (row.collections) {
      collectionsMap.set(row.collections.id, {
        id: row.collections.id,
        name: row.collections.name,
      });
    }
    const h = holdingFromRow(row);
    if (h) holdings.push(h);
  }

  return {
    holdings,
    collections: [...collectionsMap.values()].sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  };
}

/* ── Aggregators (real → v2 shapes) ─────────────────────────────── */

export function buildLiveSnapshot(
  holdings: Holding[],
  summary: PortfolioSummary,
): PortfolioSnapshot {
  let todayDollars = 0;
  let weekDollars = 0;
  let monthDollars = 0;
  let totalValue = 0;
  for (const h of holdings) {
    const mkt = h.set.currentValue * h.qty;
    totalValue += mkt;
    monthDollars += (h.set.pctChange30d / 100) * mkt;
    weekDollars += (h.set.pctChange30d / 100 / 4) * mkt;
    todayDollars += (h.set.pctChange30d / 100 / 30) * mkt;
  }
  const effectiveTotal = totalValue || summary.total_value || 0;
  return {
    totalValue: Number((summary.total_value || totalValue).toFixed(2)),
    costBasis: Number(summary.total_cost.toFixed(2)),
    gain: Number(summary.gain_loss.toFixed(2)),
    gainPct: Number(summary.gain_loss_pct.toFixed(2)),
    itemCount: summary.total_sets,
    setCount: holdings.length,
    deltaToday:
      effectiveTotal > 0
        ? Number(((todayDollars / effectiveTotal) * 100).toFixed(2))
        : 0,
    delta7d:
      effectiveTotal > 0
        ? Number(((weekDollars / effectiveTotal) * 100).toFixed(2))
        : 0,
    delta30d:
      effectiveTotal > 0
        ? Number(((monthDollars / effectiveTotal) * 100).toFixed(2))
        : 0,
    deltaAll: Number(summary.gain_loss_pct.toFixed(2)),
  };
}

export function buildLiveThemeAllocations(
  holdings: Holding[],
): ThemeAllocation[] {
  const byTheme = new Map<
    string,
    {
      slug: string;
      name: string;
      value: number;
      cost: number;
      holdings: number;
      monthContribution: number;
    }
  >();
  for (const h of holdings) {
    const key = h.set.themeSlug;
    const curr = byTheme.get(key) ?? {
      slug: key,
      name: h.set.theme,
      value: 0,
      cost: 0,
      holdings: 0,
      monthContribution: 0,
    };
    const mkt = h.set.currentValue * h.qty;
    curr.value += mkt;
    curr.cost += h.costBasisPerUnit * h.qty;
    curr.holdings += h.qty;
    curr.monthContribution += (h.set.pctChange30d / 100) * mkt;
    byTheme.set(key, curr);
  }
  return [...byTheme.values()]
    .map((t) => {
      const gain = t.value - t.cost;
      return {
        slug: t.slug,
        name: t.name,
        value: Number(t.value.toFixed(2)),
        costBasis: Number(t.cost.toFixed(2)),
        gain: Number(gain.toFixed(2)),
        gainPct: t.cost > 0 ? Number(((gain / t.cost) * 100).toFixed(2)) : 0,
        holdings: t.holdings,
        monthContribution: Number(t.monthContribution.toFixed(2)),
      };
    })
    .sort((a, b) => b.value - a.value);
}

export function buildLiveTopMovers(
  holdings: Holding[],
  limit = 5,
): { gainers: MoverRow[]; losers: MoverRow[] } {
  const rows: MoverRow[] = holdings.map((h) => {
    const mkt = h.set.currentValue * h.qty;
    const changePct = h.set.pctChange30d;
    const changeDollars = (changePct / 100) * mkt;
    return { holding: h, changeDollars, changePct };
  });
  const gainers = [...rows]
    .filter((r) => r.changePct > 0)
    .sort((a, b) => b.changeDollars - a.changeDollars)
    .slice(0, limit);
  const losers = [...rows]
    .filter((r) => r.changePct < 0)
    .sort((a, b) => a.changeDollars - b.changeDollars)
    .slice(0, limit);
  return { gainers, losers };
}

/* ── Per-collection aggregation for CollectionsStrip ─────────────── */

export interface LiveCollectionRow {
  id: string;
  name: string;
  setCount: number;
  itemCount: number;
  value: number;
  cost: number;
  delta30d: number;
  gainPct: number;
  themeSlug: string;
  sparkline: { t: number; v: number }[];
}

export function buildLiveCollectionRows(
  collections: LiveCollection[],
  holdings: Holding[],
): LiveCollectionRow[] {
  const out: LiveCollectionRow[] = [];
  for (const c of collections) {
    const inColl = holdings.filter((h) => h.collectionId === c.id);
    if (inColl.length === 0) {
      out.push({
        id: c.id,
        name: c.name,
        setCount: 0,
        itemCount: 0,
        value: 0,
        cost: 0,
        delta30d: 0,
        gainPct: 0,
        themeSlug: "",
        sparkline: [],
      });
      continue;
    }
    let value = 0;
    let cost = 0;
    let items = 0;
    let monthDollars = 0;
    for (const h of inColl) {
      const mkt = h.set.currentValue * h.qty;
      value += mkt;
      cost += h.costBasisPerUnit * h.qty;
      items += h.qty;
      monthDollars += (h.set.pctChange30d / 100) * mkt;
    }
    const delta30d = value > 0 ? (monthDollars / value) * 100 : 0;
    const gainPct = cost > 0 ? ((value - cost) / cost) * 100 : 0;
    const top = [...inColl].sort(
      (a, b) => b.set.currentValue * b.qty - a.set.currentValue * a.qty,
    )[0];
    const seedSet = top?.set;
    const sparkline = seedSet
      ? randomWalk({
          points: 60,
          start: Math.max(value * 0.85, 1),
          vol: 0.015,
          drift: delta30d / 100 / 60,
          seed: hashId(c.id),
        })
      : [];
    out.push({
      id: c.id,
      name: c.name,
      setCount: inColl.length,
      itemCount: items,
      value,
      cost,
      delta30d,
      gainPct,
      themeSlug: top?.set.themeSlug ?? "",
      sparkline,
    });
  }
  return out;
}

function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* ── Wishlist from real price_alerts (price_target only) ──────────── */

interface RawAlertRow {
  id: string;
  set_id: string;
  alert_type: string;
  target_price: number | null;
  created_at: string;
  sets:
    | {
        name: string;
        year: number;
        img_url: string | null;
        num_parts: number | null;
        num_minifigs: number | null;
        msrp_usd: number | null;
        status: SetStatus | string;
        themes: { name: string } | null;
        set_market_values: {
          market_value_new: number | null;
          market_value_used: number | null;
          pct_change_30d: number | null;
          growth_annual_pct: number | null;
        } | null;
      }
    | null;
}

/**
 * Build a wishlist view from the user's active `price_target` alerts. Each
 * alert becomes a WishlistItem with a generated sparkline.
 */
export async function fetchLiveWishlist(): Promise<WishlistItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("price_alerts")
    .select(
      "id, set_id, alert_type, target_price, created_at, sets(name, year, img_url, num_parts, num_minifigs, msrp_usd, status, themes(name), set_market_values(market_value_new, market_value_used, pct_change_30d, growth_annual_pct))",
    )
    .eq("user_id", user.id)
    .eq("alert_type", "price_target")
    .eq("status", "active");

  if (error || !data) return [];

  const items: WishlistItem[] = [];
  for (const row of data as unknown as RawAlertRow[]) {
    if (!row.sets || row.target_price == null) continue;
    const themeName = row.sets.themes?.name ?? "Other";
    const mv = row.sets.set_market_values;
    const current = mv?.market_value_new ?? mv?.market_value_used ?? row.sets.msrp_usd ?? 0;
    const set: CatalogSet = {
      id: row.set_id,
      name: row.sets.name,
      theme: themeName,
      themeSlug: slugify(themeName),
      year: row.sets.year,
      status: mapStatus(row.sets.status as string),
      imgUrl: row.sets.img_url,
      msrp: row.sets.msrp_usd ?? 0,
      currentValue: Number(current) || 0,
      pctChange30d: Number(mv?.pct_change_30d ?? 0),
      parts: row.sets.num_parts ?? 0,
      minifigs: row.sets.num_minifigs ?? 0,
      appreciation: Number(mv?.growth_annual_pct ?? 0),
    };
    const targetPrice = Number(row.target_price);
    items.push({
      set,
      targetPrice,
      addedDate: (row.created_at ?? "").slice(0, 10),
      dealDetected: set.currentValue <= targetPrice * 1.05,
      sparkline: sparklineForSet(set, 45),
    });
  }
  items.sort((a, b) => Number(b.dealDetected) - Number(a.dealDetected));
  return items;
}
