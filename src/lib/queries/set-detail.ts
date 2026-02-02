import { createClient } from "@/lib/supabase/server";
import type { CatalogSet, PriceHistoryPoint } from "@/lib/types/catalog";
import type { SetStatus } from "@/lib/types/database";

/** Shape returned by a Supabase `sets` query with theme + market value joins */
interface SetRow {
  id: string;
  name: string;
  year: number;
  theme_id: number | null;
  num_parts: number | null;
  num_minifigs: number | null;
  img_url: string | null;
  set_url: string | null;
  msrp_usd: number | null;
  status: SetStatus;
  themes: { name: string } | null;
  set_market_values: {
    market_value_new: number | null;
    market_value_used: number | null;
    pct_change_7d: number | null;
    pct_change_30d: number | null;
    pct_change_90d: number | null;
    growth_annual_pct: number | null;
    investment_score: number | null;
  } | null;
}

function flattenSetRow(row: SetRow): CatalogSet {
  const mv = row.set_market_values;
  return {
    id: row.id,
    name: row.name,
    year: row.year,
    theme_id: row.theme_id,
    theme_name: row.themes?.name ?? null,
    num_parts: row.num_parts,
    num_minifigs: row.num_minifigs,
    img_url: row.img_url,
    set_url: row.set_url,
    msrp_usd: row.msrp_usd,
    status: row.status,
    market_value_new: mv?.market_value_new ?? null,
    market_value_used: mv?.market_value_used ?? null,
    pct_change_7d: mv?.pct_change_7d ?? null,
    pct_change_30d: mv?.pct_change_30d ?? null,
    pct_change_90d: mv?.pct_change_90d ?? null,
    growth_annual_pct: mv?.growth_annual_pct ?? null,
    investment_score: mv?.investment_score ?? null,
  };
}

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
