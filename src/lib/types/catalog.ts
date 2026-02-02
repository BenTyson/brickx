import type { SetStatus } from "./database";

/** Flat interface joining sets + themes.name + set_market_values */
export interface CatalogSet {
  id: string;
  name: string;
  year: number;
  theme_id: number | null;
  theme_name: string | null;
  num_parts: number | null;
  num_minifigs: number | null;
  img_url: string | null;
  set_url: string | null;
  msrp_usd: number | null;
  status: SetStatus;
  market_value_new: number | null;
  market_value_used: number | null;
  pct_change_7d: number | null;
  pct_change_30d: number | null;
  pct_change_90d: number | null;
  growth_annual_pct: number | null;
  investment_score: number | null;
}

export type CatalogSortField =
  | "name"
  | "year"
  | "msrp_usd"
  | "market_value_new"
  | "investment_score"
  | "pct_change_30d"
  | "num_parts";

export interface CatalogSearchParams {
  q?: string;
  theme?: number[];
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  status?: SetStatus[];
  sort?: CatalogSortField;
  order?: "asc" | "desc";
  page?: number;
}

export interface CatalogResult {
  sets: CatalogSet[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PriceHistoryPoint {
  date: string;
  source: string;
  new_avg: number | null;
  new_min: number | null;
  new_max: number | null;
  used_avg: number | null;
}

export interface CatalogFilterOptions {
  themes: { id: number; name: string; count: number }[];
  yearRange: { min: number; max: number };
  priceRange: { min: number; max: number };
  statusCounts: { status: SetStatus; count: number }[];
}
