import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer } from "@/components/page-container";
import {
  fetchCatalogSets,
  fetchFilterOptions,
  parseCatalogSearchParams,
} from "@/lib/queries";
import { CatalogSearch } from "@/components/catalog/catalog-search";
import { CatalogSort } from "@/components/catalog/catalog-sort";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { MobileFilterSheet } from "@/components/catalog/mobile-filter-sheet";
import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { ActiveFilters } from "@/components/catalog/active-filters";

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
  const params = parseCatalogSearchParams(raw);

  const [result, filterOptions] = await Promise.all([
    fetchCatalogSets(params),
    fetchFilterOptions(),
  ]);

  const hasFilters = Boolean(
    params.q ||
    params.theme?.length ||
    params.status?.length ||
    params.yearMin != null ||
    params.yearMax != null ||
    params.priceMin != null ||
    params.priceMax != null,
  );

  return (
    <div className="py-8">
      <PageContainer>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Browse Sets</h1>
          <p className="text-muted-foreground mt-1">
            {result.totalCount.toLocaleString()} sets available
          </p>
        </div>

        {/* Search + Sort bar */}
        <Suspense>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="flex-1 sm:max-w-sm">
                <CatalogSearch />
              </div>
              <MobileFilterSheet options={filterOptions} />
            </div>
            <CatalogSort />
          </div>
        </Suspense>

        {/* Active filters */}
        <Suspense>
          <div className="mb-4">
            <ActiveFilters options={filterOptions} />
          </div>
        </Suspense>

        {/* Main layout: sidebar + grid */}
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar (desktop only) */}
          <aside className="hidden lg:block">
            <Suspense>
              <CatalogFilters options={filterOptions} />
            </Suspense>
          </aside>

          {/* Grid + Pagination */}
          <div className="space-y-8">
            <CatalogGrid
              sets={result.sets}
              hasFilters={hasFilters}
              onClearFilters="/sets"
            />
            <Suspense>
              <CatalogPagination
                currentPage={result.page}
                totalPages={result.totalPages}
                totalCount={result.totalCount}
                pageSize={result.pageSize}
              />
            </Suspense>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
