"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FadeIn, StaggerChildren } from "@/components/motion";
import { SetCardV2 } from "@/components/ui/set-card-v2";
import { CatalogPagination } from "./catalog-pagination";
import { FilterRail, type CatalogFiltersState, type ThemeOption } from "./filter-rail";
import { ActiveFilterBar } from "./active-filter-bar";
import { CatalogToolbar, type CatalogView } from "./catalog-toolbar";
import { CatalogEmpty } from "./catalog-empty";
import { CatalogListView } from "./catalog-list-view";
import { CATALOG_SORTS } from "@/lib/view-models/catalog";
import type { CatalogSetView } from "@/lib/view-models/catalog";

interface CatalogPageProps {
  sets: CatalogSetView[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: CatalogFiltersState;
  view: CatalogView;
  themeOptions: ThemeOption[];
  yearRange: [number, number];
  priceRange: [number, number];
  partsRange: [number, number];
}

export function CatalogPage({
  sets,
  totalCount,
  page,
  pageSize,
  totalPages,
  filters,
  view,
  themeOptions,
  yearRange,
  priceRange,
  partsRange,
}: CatalogPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pushParams = useCallback(
    (next: CatalogFiltersState, opts: { view?: CatalogView; page?: number } = {}) => {
      const params = filtersToSearchParams(next, {
        view: opts.view ?? view,
        page: opts.page,
      });
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, view],
  );

  const onChange = useCallback(
    (patch: Partial<CatalogFiltersState>) => {
      const merged: CatalogFiltersState = { ...filters, ...patch };
      // any filter change resets pagination
      pushParams(merged, { page: 1 });
    },
    [filters, pushParams],
  );

  const onClearAll = useCallback(() => {
    const base: CatalogFiltersState = {
      statuses: [],
      themeIds: [],
      sort: filters.sort,
    };
    pushParams(base, { page: 1 });
  }, [filters.sort, pushParams]);

  const onViewChange = useCallback(
    (v: CatalogView) => {
      pushParams(filters, { view: v });
    },
    [filters, pushParams],
  );

  const hasAnyFilter =
    filters.statuses.length +
      filters.themeIds.length +
      (filters.q ? 1 : 0) +
      (filters.yearMin != null ? 1 : 0) +
      (filters.yearMax != null ? 1 : 0) +
      (filters.priceMin != null ? 1 : 0) +
      (filters.priceMax != null ? 1 : 0) +
      (filters.partsMin != null ? 1 : 0) +
      (filters.partsMax != null ? 1 : 0) >
    0;

  const linkForPage = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (p === 1) params.delete("page");
      else params.set("page", String(p));
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams],
  );

  return (
    <div className="mx-auto max-w-[1320px] px-6 pb-24 pt-10 sm:px-10 lg:px-14">
      <FadeIn>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-micro font-mono font-tabular text-text-tertiary">
              Browse · Catalog
            </div>
            <h1 className="mt-5 max-w-[720px] text-h1 font-serif-display text-text-primary">
              Every set, indexed and charted.
            </h1>
            <p className="mt-5 max-w-[560px] text-body text-text-secondary">
              Filter by status, theme, year, MSRP, and piece count. Click any
              set to see its price history and market fundamentals.
            </p>
          </div>
          <Link
            href="/themes"
            className="hidden shrink-0 items-center gap-1 text-small text-text-tertiary transition hover:text-text-primary md:inline-flex"
          >
            Browse themes →
          </Link>
        </div>
      </FadeIn>

      <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
        <FilterRail
          filters={filters}
          resultCount={totalCount}
          themeOptions={themeOptions}
          yearRange={yearRange}
          priceRange={priceRange}
          partsRange={partsRange}
          onChange={onChange}
          onClearAll={onClearAll}
        />

        <div className="flex flex-col gap-5 min-w-0">
          <CatalogToolbar
            filters={filters}
            view={view}
            resultCount={totalCount}
            onChange={onChange}
            onViewChange={onViewChange}
          />
          <ActiveFilterBar
            filters={filters}
            themeOptions={themeOptions}
            yearRange={yearRange}
            priceRange={priceRange}
            partsRange={partsRange}
            onChange={onChange}
            onClearAll={onClearAll}
          />

          {sets.length === 0 ? (
            <CatalogEmpty onClear={hasAnyFilter ? onClearAll : undefined} />
          ) : view === "grid" ? (
            <StaggerChildren
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              stagger={0.035}
              distance={12}
            >
              {sets.map((s) => (
                <SetCardV2
                  key={s.id}
                  id={s.id}
                  name={s.name}
                  theme={s.theme}
                  year={s.year}
                  status={s.status}
                  imgUrl={s.imgUrl ?? undefined}
                  msrp={s.msrp}
                  currentValue={s.currentValue}
                  pctChange={s.pctChange30d}
                  href={`/sets/${s.id}`}
                />
              ))}
            </StaggerChildren>
          ) : (
            <CatalogListView sets={sets} />
          )}

          {totalPages > 1 && (
            <CatalogPagination
              currentPage={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              linkForPage={linkForPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── URL helpers ─────────────────────────────────────────── */

function filtersToSearchParams(
  f: CatalogFiltersState,
  opts: { view?: CatalogView; page?: number },
): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.statuses.length) p.set("status", f.statuses.join(","));
  if (f.themeIds.length) p.set("theme", f.themeIds.join(","));
  if (f.yearMin != null) p.set("yearMin", String(f.yearMin));
  if (f.yearMax != null) p.set("yearMax", String(f.yearMax));
  if (f.priceMin != null) p.set("priceMin", String(f.priceMin));
  if (f.priceMax != null) p.set("priceMax", String(f.priceMax));
  if (f.partsMin != null) p.set("partsMin", String(f.partsMin));
  if (f.partsMax != null) p.set("partsMax", String(f.partsMax));
  if (f.sort && f.sort !== CATALOG_SORTS[0].key) p.set("sort", f.sort);
  if (opts.view && opts.view !== "grid") p.set("view", opts.view);
  if (opts.page != null && opts.page > 1) p.set("page", String(opts.page));
  return p;
}
