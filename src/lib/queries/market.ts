import { createClient } from "@/lib/supabase/server";
import type { CatalogResult, CatalogSet } from "@/lib/types/catalog";
import { type SetRow, flattenSetRow } from "./helpers";

const PAGE_SIZE = 24;

/** Fetch sets trending by price change over 7d or 30d */
export async function fetchTrendingSets(
  period: "7d" | "30d" = "7d",
  page = 1,
  pageSize = PAGE_SIZE,
): Promise<CatalogResult> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const sortField = period === "7d" ? "pct_change_7d" : "pct_change_30d";

  const { data, count, error } = await supabase
    .from("sets")
    .select("*, themes(name), set_market_values(*)", { count: "exact" })
    .not("set_market_values", "is", null)
    .order(sortField, {
      referencedTable: "set_market_values",
      ascending: false,
      nullsFirst: false,
    })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch trending sets: ${error.message}`);
  }

  const totalCount = count ?? 0;
  const sets: CatalogSet[] = ((data ?? []) as unknown as SetRow[]).map(
    flattenSetRow,
  );

  return {
    sets,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

/** Fetch retired sets ordered by year descending */
export async function fetchRetiringSets(
  page = 1,
  pageSize = PAGE_SIZE,
): Promise<CatalogResult> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from("sets")
    .select("*, themes(name), set_market_values(*)", { count: "exact" })
    .eq("status", "retired")
    .order("year", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch retiring sets: ${error.message}`);
  }

  const totalCount = count ?? 0;
  const sets: CatalogSet[] = ((data ?? []) as unknown as SetRow[]).map(
    flattenSetRow,
  );

  return {
    sets,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

/** Fetch new releases (current year and previous year) ordered by year descending */
export async function fetchNewReleases(
  page = 1,
  pageSize = PAGE_SIZE,
): Promise<CatalogResult> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const currentYear = new Date().getFullYear();

  const { data, count, error } = await supabase
    .from("sets")
    .select("*, themes(name), set_market_values(*)", { count: "exact" })
    .gte("year", currentYear - 1)
    .order("year", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch new releases: ${error.message}`);
  }

  const totalCount = count ?? 0;
  const sets: CatalogSet[] = ((data ?? []) as unknown as SetRow[]).map(
    flattenSetRow,
  );

  return {
    sets,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

/** Fetch sets with highest investment scores, with optional price range filter */
export async function fetchTopInvestments(
  priceMin?: number,
  priceMax?: number,
  page = 1,
  pageSize = PAGE_SIZE,
): Promise<CatalogResult> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("sets")
    .select("*, themes(name), set_market_values(*)", { count: "exact" })
    .not("set_market_values", "is", null);

  if (priceMin != null) {
    query = query.gte("msrp_usd", priceMin);
  }
  if (priceMax != null) {
    query = query.lte("msrp_usd", priceMax);
  }

  query = query
    .order("investment_score", {
      referencedTable: "set_market_values",
      ascending: false,
      nullsFirst: false,
    })
    .range(from, to);

  const { data, count, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch top investments: ${error.message}`);
  }

  const totalCount = count ?? 0;
  const sets: CatalogSet[] = ((data ?? []) as unknown as SetRow[]).map(
    flattenSetRow,
  );

  return {
    sets,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}
