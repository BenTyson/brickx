import { createClient } from "@/lib/supabase/server";
import type {
  CollectionSummary,
  CollectionWithItems,
  CollectionItem,
  PortfolioSummary,
} from "@/lib/types/collection";

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
