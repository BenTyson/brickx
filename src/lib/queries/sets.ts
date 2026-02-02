import { createClient } from "@/lib/supabase/server";
import type {
  CatalogFilterOptions,
  CatalogResult,
  CatalogSearchParams,
  CatalogSet,
  CatalogSortField,
} from "@/lib/types/catalog";
import type { SetStatus } from "@/lib/types/database";
import { type SetRow, flattenSetRow } from "./helpers";

const PAGE_SIZE = 24;

const VALID_SORT_FIELDS: CatalogSortField[] = [
  "name",
  "year",
  "msrp_usd",
  "market_value_new",
  "investment_score",
  "pct_change_30d",
  "num_parts",
];

/** Fields that live on the set_market_values join table */
const MARKET_VALUE_FIELDS = new Set<CatalogSortField>([
  "market_value_new",
  "investment_score",
  "pct_change_30d",
]);

export async function fetchCatalogSets(
  params: CatalogSearchParams,
): Promise<CatalogResult> {
  const supabase = await createClient();
  const page = params.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("sets")
    .select("*, themes(name), set_market_values(*)", { count: "exact" });

  // Text search
  if (params.q) {
    query = query.ilike("name", `%${params.q}%`);
  }

  // Theme filter
  if (params.theme && params.theme.length > 0) {
    query = query.in("theme_id", params.theme);
  }

  // Year range
  if (params.yearMin != null) {
    query = query.gte("year", params.yearMin);
  }
  if (params.yearMax != null) {
    query = query.lte("year", params.yearMax);
  }

  // MSRP price range
  if (params.priceMin != null) {
    query = query.gte("msrp_usd", params.priceMin);
  }
  if (params.priceMax != null) {
    query = query.lte("msrp_usd", params.priceMax);
  }

  // Status filter
  if (params.status && params.status.length > 0) {
    query = query.in("status", params.status);
  }

  // Sorting
  const sortField = params.sort ?? "name";
  const ascending = (params.order ?? "asc") === "asc";

  if (MARKET_VALUE_FIELDS.has(sortField)) {
    query = query.order(sortField, {
      referencedTable: "set_market_values",
      ascending,
      nullsFirst: false,
    });
  } else {
    query = query.order(sortField, { ascending, nullsFirst: false });
  }

  // Pagination
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch catalog sets: ${error.message}`);
  }

  const totalCount = count ?? 0;
  const sets: CatalogSet[] = ((data ?? []) as unknown as SetRow[]).map(
    flattenSetRow,
  );

  return {
    sets,
    totalCount,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
  };
}

/** Parse raw URL searchParams into typed CatalogSearchParams */
export function parseCatalogSearchParams(
  raw: Record<string, string | string[] | undefined>,
): CatalogSearchParams {
  const params: CatalogSearchParams = {};

  // Search query
  const q = getString(raw.q);
  if (q) params.q = q;

  // Theme IDs (comma-separated)
  const themeStr = getString(raw.theme);
  if (themeStr) {
    const ids = themeStr
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n) && n > 0);
    if (ids.length > 0) params.theme = ids;
  }

  // Year range
  const yearMin = getInt(raw.yearMin);
  if (yearMin != null) params.yearMin = yearMin;
  const yearMax = getInt(raw.yearMax);
  if (yearMax != null) params.yearMax = yearMax;

  // Price range
  const priceMin = getFloat(raw.priceMin);
  if (priceMin != null) params.priceMin = priceMin;
  const priceMax = getFloat(raw.priceMax);
  if (priceMax != null) params.priceMax = priceMax;

  // Status (comma-separated)
  const statusStr = getString(raw.status);
  if (statusStr) {
    const validStatuses: SetStatus[] = ["available", "retired", "unreleased"];
    const statuses = statusStr
      .split(",")
      .filter((s): s is SetStatus => validStatuses.includes(s as SetStatus));
    if (statuses.length > 0) params.status = statuses;
  }

  // Sort
  const sort = getString(raw.sort) as CatalogSortField | undefined;
  if (sort && VALID_SORT_FIELDS.includes(sort)) {
    params.sort = sort;
  }

  // Order
  const order = getString(raw.order);
  if (order === "asc" || order === "desc") {
    params.order = order;
  }

  // Page
  const page = getInt(raw.page);
  if (page != null && page >= 1) params.page = page;

  return params;
}

/** Fetch options for the filter sidebar */
export async function fetchFilterOptions(): Promise<CatalogFilterOptions> {
  const supabase = await createClient();

  // Fetch all in parallel
  const [themesRes, yearRes, priceRes, statusRes] = await Promise.all([
    // Theme counts: count sets per theme, join theme name
    supabase
      .from("sets")
      .select("theme_id, themes(name)")
      .not("theme_id", "is", null),

    // Year range
    supabase
      .from("sets")
      .select("year")
      .order("year", { ascending: true })
      .limit(1)
      .single(),

    // Price range
    supabase
      .from("sets")
      .select("msrp_usd")
      .not("msrp_usd", "is", null)
      .order("msrp_usd", { ascending: true })
      .limit(1)
      .single(),

    // Status counts
    supabase.from("sets").select("status"),
  ]);

  // Aggregate theme counts manually
  const themeCounts = new Map<number, { name: string; count: number }>();
  if (themesRes.data) {
    for (const row of themesRes.data) {
      if (row.theme_id == null) continue;
      const existing = themeCounts.get(row.theme_id);
      const themeName =
        (row.themes as unknown as { name: string } | null)?.name ?? "Unknown";
      if (existing) {
        existing.count++;
      } else {
        themeCounts.set(row.theme_id, { name: themeName, count: 1 });
      }
    }
  }

  const themes = Array.from(themeCounts.entries())
    .map(([id, { name, count }]) => ({ id, name, count }))
    .sort((a, b) => b.count - a.count);

  // Year range — fetch max separately
  const yearMaxRes = await (await createClient())
    .from("sets")
    .select("year")
    .order("year", { ascending: false })
    .limit(1)
    .single();

  // Price range — fetch max separately
  const priceMaxRes = await (await createClient())
    .from("sets")
    .select("msrp_usd")
    .not("msrp_usd", "is", null)
    .order("msrp_usd", { ascending: false })
    .limit(1)
    .single();

  // Status counts
  const statusCountMap = new Map<SetStatus, number>();
  if (statusRes.data) {
    for (const row of statusRes.data) {
      statusCountMap.set(row.status, (statusCountMap.get(row.status) ?? 0) + 1);
    }
  }

  const statusCounts: CatalogFilterOptions["statusCounts"] = (
    ["available", "retired", "unreleased"] as SetStatus[]
  ).map((status) => ({
    status,
    count: statusCountMap.get(status) ?? 0,
  }));

  return {
    themes,
    yearRange: {
      min: yearRes.data?.year ?? 1949,
      max: yearMaxRes.data?.year ?? new Date().getFullYear(),
    },
    priceRange: {
      min: priceRes.data?.msrp_usd ?? 0,
      max: priceMaxRes.data?.msrp_usd ?? 1000,
    },
    statusCounts,
  };
}

// ── Helpers ──────────────────────────────────────────────

function getString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value || undefined;
}

function getInt(value: string | string[] | undefined): number | undefined {
  const str = getString(value);
  if (!str) return undefined;
  const n = parseInt(str, 10);
  return isNaN(n) ? undefined : n;
}

function getFloat(value: string | string[] | undefined): number | undefined {
  const str = getString(value);
  if (!str) return undefined;
  const n = parseFloat(str);
  return isNaN(n) ? undefined : n;
}
