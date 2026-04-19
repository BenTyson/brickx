import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { CatalogGridSkeleton } from "@/components/catalog/catalog-skeleton";
import type { CatalogFiltersState } from "@/components/catalog/filter-rail";
import type { CatalogView } from "@/components/catalog/catalog-toolbar";
import {
  fetchCatalogSets,
  fetchFilterOptions,
  parseCatalogSearchParams,
} from "@/lib/queries";
import {
  CATALOG_SORTS,
  toCatalogSetView,
  sortDescriptorFromUrl,
} from "@/lib/view-models/catalog";

export const metadata: Metadata = {
  title: "Browse LEGO Sets | BrickX",
  description:
    "Search, filter, and sort through thousands of LEGO sets. Track market values and find investment opportunities.",
};

export default async function SetsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;

  // Sort: accept sort-key from the v2 toolbar (e.g. "trending") and map
  // to CatalogSearchParams field/order; legacy ?sort=field still works.
  const sortKey = typeof raw.sort === "string" ? raw.sort : undefined;
  const descriptor = CATALOG_SORTS.find((s) => s.key === sortKey);
  const paramsRaw: Record<string, string | string[] | undefined> = { ...raw };
  if (descriptor) {
    paramsRaw.sort = descriptor.field;
    paramsRaw.order = descriptor.order;
  }
  const params = parseCatalogSearchParams(paramsRaw);

  const [result, filterOptions] = await Promise.all([
    fetchCatalogSets(params),
    fetchFilterOptions(),
  ]);

  const view: CatalogView =
    raw.view === "list" ? "list" : "grid";

  const filters: CatalogFiltersState = {
    q: params.q,
    statuses: params.status ?? [],
    themeIds: params.theme ?? [],
    yearMin: params.yearMin,
    yearMax: params.yearMax,
    priceMin: params.priceMin,
    priceMax: params.priceMax,
    partsMin: params.partsMin,
    partsMax: params.partsMax,
    sort:
      sortDescriptorFromUrl(params.sort, params.order).key ??
      CATALOG_SORTS[0].key,
  };

  const sets = result.sets.map(toCatalogSetView);

  return (
    <Suspense fallback={<SetsPageSkeleton />}>
      <CatalogPage
        sets={sets}
        totalCount={result.totalCount}
        page={result.page}
        pageSize={result.pageSize}
        totalPages={result.totalPages}
        filters={filters}
        view={view}
        themeOptions={filterOptions.themes}
        yearRange={[filterOptions.yearRange.min, filterOptions.yearRange.max]}
        priceRange={[filterOptions.priceRange.min, filterOptions.priceRange.max]}
        partsRange={[filterOptions.partsRange.min, filterOptions.partsRange.max]}
      />
    </Suspense>
  );
}

function SetsPageSkeleton() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 pb-24 pt-10 sm:px-10 lg:px-14">
      <CatalogGridSkeleton />
    </div>
  );
}
