import { createClient } from "@/lib/supabase/server";
import type {
  CollectionSummary,
  CollectionWithItems,
  CollectionItem,
  CollectionMover,
  PortfolioHistory,
  PortfolioHistoryRange,
  PortfolioSummary,
  ThemeAttribution,
} from "@/lib/types/collection";

const RANGE_DAYS: Record<PortfolioHistoryRange, number | null> = {
  "1W": 7,
  "1M": 30,
  "3M": 90,
  "1Y": 365,
  ALL: null,
};

/** Fetch all collections for the current user with item counts */
export async function fetchUserCollections(): Promise<CollectionSummary[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("collections")
    .select("id, name, created_at, collection_items(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((c) => ({
    id: c.id,
    name: c.name,
    created_at: c.created_at,
    item_count:
      (c.collection_items as unknown as { count: number }[])[0]?.count ?? 0,
  }));
}

/** Fetch a single collection with all its items and joined set/market data */
export async function fetchCollectionDetail(
  id: string,
): Promise<CollectionWithItems | null> {
  const supabase = await createClient();

  const { data: collection, error: collError } = await supabase
    .from("collections")
    .select("id, name, created_at")
    .eq("id", id)
    .single();

  if (collError || !collection) return null;

  const { data: items, error: itemsError } = await supabase
    .from("collection_items")
    .select(
      "id, collection_id, set_id, condition, purchase_price, purchase_date, notes, created_at, updated_at, sets(name, img_url, year, themes(name)), set_market_values:sets!inner(set_market_values(market_value_new, market_value_used))",
    )
    .eq("collection_id", id)
    .order("created_at", { ascending: false });

  if (itemsError || !items) {
    return { ...collection, items: [] };
  }

  const mappedItems: CollectionItem[] = items.map((item) => {
    const setData = item.sets as unknown as {
      name: string;
      img_url: string | null;
      year: number;
      themes: { name: string } | null;
    };
    const marketValues = item.set_market_values as unknown as {
      set_market_values: {
        market_value_new: number | null;
        market_value_used: number | null;
      }[];
    };
    const mv = marketValues?.set_market_values?.[0];

    return {
      id: item.id,
      collection_id: item.collection_id,
      set_id: item.set_id,
      condition: item.condition,
      purchase_price: item.purchase_price,
      purchase_date: item.purchase_date,
      notes: item.notes,
      created_at: item.created_at,
      updated_at: item.updated_at,
      set_name: setData?.name ?? "Unknown Set",
      set_img_url: setData?.img_url ?? null,
      theme_name: setData?.themes?.name ?? null,
      year: setData?.year ?? 0,
      market_value_new: mv?.market_value_new ?? null,
      market_value_used: mv?.market_value_used ?? null,
    };
  });

  return {
    ...collection,
    items: mappedItems,
  };
}

/** Fetch which of the user's collections contain a specific set */
export async function fetchCollectionsContainingSet(
  setId: string,
): Promise<{ collection_id: string; collection_name: string }[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("collection_items")
    .select("collection_id, collections(name)")
    .eq("set_id", setId);

  if (error || !data) return [];

  return data.map((row) => ({
    collection_id: row.collection_id,
    collection_name:
      (row.collections as unknown as { name: string })?.name ?? "",
  }));
}

/** Fetch aggregated portfolio summary for the current user */
export async function fetchPortfolioSummary(): Promise<PortfolioSummary> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const empty: PortfolioSummary = {
    total_value: 0,
    total_cost: 0,
    gain_loss: 0,
    gain_loss_pct: 0,
    total_sets: 0,
    collections: [],
  };

  if (!user) return empty;

  const { data: collections, error: collError } = await supabase
    .from("collections")
    .select("id, name")
    .eq("user_id", user.id);

  if (collError || !collections || collections.length === 0) return empty;

  let totalValue = 0;
  let totalCost = 0;
  let totalSets = 0;

  const collectionBreakdown: PortfolioSummary["collections"] = [];

  for (const coll of collections) {
    const { data: items } = await supabase
      .from("collection_items")
      .select(
        "condition, purchase_price, sets!inner(set_market_values(market_value_new, market_value_used))",
      )
      .eq("collection_id", coll.id);

    if (!items) continue;

    let collValue = 0;
    let collCost = 0;

    for (const item of items) {
      const mv = (
        item.sets as unknown as {
          set_market_values: {
            market_value_new: number | null;
            market_value_used: number | null;
          }[];
        }
      )?.set_market_values?.[0];

      const value =
        item.condition === "new"
          ? (mv?.market_value_new ?? 0)
          : (mv?.market_value_used ?? 0);
      const cost = item.purchase_price ?? 0;

      collValue += value;
      collCost += cost;
    }

    totalValue += collValue;
    totalCost += collCost;
    totalSets += items.length;

    collectionBreakdown.push({
      id: coll.id,
      name: coll.name,
      item_count: items.length,
      total_value: collValue,
      total_cost: collCost,
      gain_loss_pct:
        collCost > 0 ? ((collValue - collCost) / collCost) * 100 : 0,
    });
  }

  return {
    total_value: totalValue,
    total_cost: totalCost,
    gain_loss: totalValue - totalCost,
    gain_loss_pct:
      totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0,
    total_sets: totalSets,
    collections: collectionBreakdown,
  };
}

/** Historical portfolio value for the authenticated user, bucketed by day. */
export async function fetchPortfolioHistory(
  range: PortfolioHistoryRange = "1M",
): Promise<PortfolioHistory> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { range, points: [] };

  let query = supabase
    .from("portfolio_snapshots")
    .select("snapshot_date, total_value, cost_basis, item_count")
    .eq("user_id", user.id)
    .order("snapshot_date", { ascending: true });

  const days = RANGE_DAYS[range];
  if (days != null) {
    const since = new Date();
    since.setUTCHours(0, 0, 0, 0);
    since.setUTCDate(since.getUTCDate() - days);
    query = query.gte("snapshot_date", since.toISOString().slice(0, 10));
  }

  const { data, error } = await query;
  if (error || !data) return { range, points: [] };

  return {
    range,
    points: data.map((r) => ({
      date: r.snapshot_date,
      total_value: Number(r.total_value),
      cost_basis: Number(r.cost_basis),
      item_count: r.item_count,
    })),
  };
}

/** Per-theme gain over the range, derived from first and last snapshot in window. */
export async function fetchThemeAttribution(
  range: PortfolioHistoryRange = "1M",
): Promise<ThemeAttribution[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("portfolio_snapshots")
    .select("snapshot_date, by_theme_json")
    .eq("user_id", user.id)
    .order("snapshot_date", { ascending: true });

  const days = RANGE_DAYS[range];
  if (days != null) {
    const since = new Date();
    since.setUTCHours(0, 0, 0, 0);
    since.setUTCDate(since.getUTCDate() - days);
    query = query.gte("snapshot_date", since.toISOString().slice(0, 10));
  }

  const { data, error } = await query;
  if (error || !data || data.length === 0) return [];

  const start = data[0].by_theme_json as Record<string, number>;
  const end = data[data.length - 1].by_theme_json as Record<string, number>;

  const themes = new Set([...Object.keys(start), ...Object.keys(end)]);
  const rows: ThemeAttribution[] = [];
  for (const theme of themes) {
    const startValue = start[theme] ?? 0;
    const endValue = end[theme] ?? 0;
    rows.push({
      theme,
      start_value: startValue,
      end_value: endValue,
      gain: endValue - startValue,
    });
  }

  rows.sort((a, b) => Math.abs(b.gain) - Math.abs(a.gain));
  return rows;
}

/** Top movers across the user's holdings, ranked by 30-day percent change. */
export async function fetchTopMovers(
  limit = 5,
): Promise<{ gainers: CollectionMover[]; losers: CollectionMover[] }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { gainers: [], losers: [] };

  const { data, error } = await supabase
    .from("collection_items")
    .select(
      "set_id, condition, sets!inner(name, img_url, themes(name), set_market_values(market_value_new, market_value_used, pct_change_30d)), collections!inner(user_id)",
    )
    .eq("collections.user_id", user.id);

  if (error || !data) return { gainers: [], losers: [] };

  const bySet = new Map<string, CollectionMover>();
  for (const row of data) {
    if (bySet.has(row.set_id)) continue;
    const set = row.sets as unknown as {
      name: string;
      img_url: string | null;
      themes: { name: string } | null;
      set_market_values: {
        market_value_new: number | null;
        market_value_used: number | null;
        pct_change_30d: number | null;
      }[];
    };
    const mv = set?.set_market_values?.[0];
    const marketValue =
      row.condition === "new"
        ? (mv?.market_value_new ?? 0)
        : (mv?.market_value_used ?? 0);
    bySet.set(row.set_id, {
      set_id: row.set_id,
      set_name: set?.name ?? "Unknown Set",
      set_img_url: set?.img_url ?? null,
      theme_name: set?.themes?.name ?? null,
      market_value: marketValue,
      pct_change_30d: mv?.pct_change_30d ?? null,
    });
  }

  const rows = [...bySet.values()].filter((r) => r.pct_change_30d != null);
  const gainers = [...rows]
    .filter((r) => (r.pct_change_30d ?? 0) > 0)
    .sort((a, b) => (b.pct_change_30d ?? 0) - (a.pct_change_30d ?? 0))
    .slice(0, limit);
  const losers = [...rows]
    .filter((r) => (r.pct_change_30d ?? 0) < 0)
    .sort((a, b) => (a.pct_change_30d ?? 0) - (b.pct_change_30d ?? 0))
    .slice(0, limit);

  return { gainers, losers };
}
