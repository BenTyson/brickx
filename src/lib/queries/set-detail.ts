import { createClient } from "@/lib/supabase/server";
import type { CatalogSet, PriceHistoryPoint } from "@/lib/types/catalog";
import { type SetRow, flattenSetRow } from "./helpers";

/** Fetch a single set with theme name and market values */
export async function fetchSetDetail(id: string): Promise<CatalogSet | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sets")
    .select("*, themes(name), set_market_values(*)")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return flattenSetRow(data as unknown as SetRow);
}

/** Fetch all price history rows for a set, ordered by date ascending */
export async function fetchPriceHistory(
  setId: string,
): Promise<PriceHistoryPoint[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("set_prices")
    .select("fetched_at, source, new_avg, new_min, new_max, used_avg")
    .eq("set_id", setId)
    .order("fetched_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    date: row.fetched_at,
    source: row.source,
    new_avg: row.new_avg,
    new_min: row.new_min,
    new_max: row.new_max,
    used_avg: row.used_avg,
  }));
}

/** Fetch related sets from the same theme */
export async function fetchRelatedSets(
  themeId: number,
  excludeId: string,
  limit = 6,
): Promise<CatalogSet[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sets")
    .select("*, themes(name), set_market_values(*)")
    .eq("theme_id", themeId)
    .neq("id", excludeId)
    .order("year", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return (data as unknown as SetRow[]).map(flattenSetRow);
}
