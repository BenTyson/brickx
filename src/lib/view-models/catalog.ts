/**
 * View-models that adapt real DB catalog types (`@/lib/types/catalog`) to the
 * shape catalog/detail components consume. Keeps the components backend-agnostic
 * and lets pages pass already-flattened data in.
 */

import type { CatalogSet } from "@/lib/types/catalog";
import type { SetStatus } from "@/lib/types/database";
import { slugify } from "@/lib/utils/slug";

export type CatalogSetStatus = SetStatus;

/** Flat, presentation-ready shape for cards / tables / detail hero. */
export interface CatalogSetView {
  id: string;
  name: string;
  theme: string;
  themeSlug: string;
  year: number;
  status: CatalogSetStatus;
  imgUrl: string | null;
  msrp: number;
  currentValue: number;
  pctChange30d: number;
  parts: number;
  minifigs: number;
  /** Annualized growth % since release, if known. */
  appreciation: number;
}

export function toCatalogSetView(set: CatalogSet): CatalogSetView {
  const theme = set.theme_name ?? "Unknown";
  const msrp = set.msrp_usd ?? 0;
  return {
    id: set.id,
    name: set.name,
    theme,
    themeSlug: slugify(theme),
    year: set.year,
    status: set.status,
    imgUrl: set.img_url,
    msrp,
    currentValue: set.market_value_new ?? msrp,
    pctChange30d: set.pct_change_30d ?? 0,
    parts: set.num_parts ?? 0,
    minifigs: set.num_minifigs ?? 0,
    appreciation: set.growth_annual_pct ?? 0,
  };
}

export interface CatalogSortDescriptor {
  field:
    | "pct_change_30d"
    | "market_value_new"
    | "investment_score"
    | "year"
    | "name"
    | "num_parts";
  order: "asc" | "desc";
  label: string;
  key: string;
}

export const CATALOG_SORTS: CatalogSortDescriptor[] = [
  { key: "trending", field: "pct_change_30d", order: "desc", label: "Trending (30d)" },
  {
    key: "appreciation-desc",
    field: "investment_score",
    order: "desc",
    label: "Investment score · High",
  },
  {
    key: "price-desc",
    field: "market_value_new",
    order: "desc",
    label: "Market value · High",
  },
  {
    key: "price-asc",
    field: "market_value_new",
    order: "asc",
    label: "Market value · Low",
  },
  { key: "year-desc", field: "year", order: "desc", label: "Year · Newest" },
  { key: "year-asc", field: "year", order: "asc", label: "Year · Oldest" },
  { key: "name-asc", field: "name", order: "asc", label: "Name · A–Z" },
];

export function sortDescriptorFromUrl(
  sortField: string | undefined,
  order: string | undefined,
): CatalogSortDescriptor {
  if (!sortField) return CATALOG_SORTS[0];
  const match = CATALOG_SORTS.find(
    (s) => s.field === sortField && s.order === (order ?? "desc"),
  );
  return match ?? CATALOG_SORTS[0];
}
