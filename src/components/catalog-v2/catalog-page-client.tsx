"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FadeIn } from "@/components/motion";
import { SetCardV2 } from "@/components/ui/set-card-v2";
import { FilterRail } from "./filter-rail";
import { ActiveFilterBar } from "./active-filter-bar";
import { CatalogToolbar, type CatalogView } from "./catalog-toolbar";
import { CatalogEmpty } from "./catalog-empty";
import { CatalogGridSkeleton } from "./catalog-skeleton";
import { CatalogListView } from "./catalog-list-view";
import {
  applyCatalogFilters,
  CATALOG_SETS,
  CATALOG_STATUSES,
  sparklineForSet,
  type CatalogFilters,
  type SetStatus,
} from "@/lib/mock/catalog";

interface CatalogPageClientProps {
  onOpenPalette: () => void;
}

const DEFAULT_FILTERS: CatalogFilters = {
  statuses: [],
  themes: [],
  sort: "trending",
};

export function CatalogPageClient({ onOpenPalette }: CatalogPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFiltersFromSearch(searchParams),
    [searchParams],
  );
  const view: CatalogView =
    (searchParams.get("view") as CatalogView) ?? "grid";

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Mimic a brief data-fetch so the skeleton state is visible on first paint.
    const t = setTimeout(() => setLoading(false), 220);
    return () => clearTimeout(t);
  }, []);

  const results = useMemo(
    () => applyCatalogFilters(CATALOG_SETS, filters),
    [filters],
  );

  const writeUrl = useCallback(
    (next: Partial<CatalogFilters>, opts?: { view?: CatalogView }) => {
      const merged: CatalogFilters = { ...filters, ...next };
      const params = filtersToSearchParams(merged);
      const nextView = opts?.view ?? view;
      if (nextView !== "grid") params.set("view", nextView);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [filters, view, pathname, router],
  );

  const onChange = useCallback(
    (patch: Partial<CatalogFilters>) => writeUrl(patch),
    [writeUrl],
  );
  const onClearAll = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);
  const onViewChange = useCallback(
    (v: CatalogView) => writeUrl({}, { view: v }),
    [writeUrl],
  );

  return (
    <div className="mx-auto max-w-[1320px] px-6 pb-24 pt-10 sm:px-10 lg:px-14">
      <FadeIn>
        <div className="text-micro font-mono font-tabular text-text-tertiary">
          D4 · Browse sets
        </div>
        <h1 className="mt-5 max-w-[720px] text-h1 font-serif-display text-text-primary">
          Every set, indexed and charted.
        </h1>
        <p className="mt-5 max-w-[560px] text-body text-text-secondary">
          Filter by status, theme, year, market value, and piece count. Hit
          <kbd className="mx-1.5 inline-flex items-center gap-0.5 rounded border border-border-thin bg-bg-raised px-1.5 py-0.5 text-[11px] font-mono font-tabular text-text-secondary">
            ⌘K
          </kbd>
          to search across sets, themes, and minifigs.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
        <FilterRail
          filters={filters}
          resultCount={results.length}
          onChange={onChange}
          onClearAll={onClearAll}
        />

        <div className="flex flex-col gap-5 min-w-0">
          <CatalogToolbar
            filters={filters}
            view={view}
            resultCount={results.length}
            onChange={onChange}
            onViewChange={onViewChange}
            onOpenPalette={onOpenPalette}
          />
          <ActiveFilterBar
            filters={filters}
            onChange={onChange}
            onClearAll={onClearAll}
          />

          {loading ? (
            <CatalogGridSkeleton />
          ) : results.length === 0 ? (
            <CatalogEmpty onClear={onClearAll} />
          ) : view === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((s) => (
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
                  sparkline={sparklineForSet(s, 45)}
                  href={`#set-${s.id}`}
                />
              ))}
            </div>
          ) : (
            <CatalogListView sets={results} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── URL ↔ filters ─────────────────────────────────────────────── */

function parseFiltersFromSearch(sp: URLSearchParams): CatalogFilters {
  const f = { ...DEFAULT_FILTERS };

  const q = sp.get("q");
  if (q) f.q = q;

  const statuses = sp.get("status")?.split(",").filter(Boolean) ?? [];
  f.statuses = statuses.filter((s): s is SetStatus =>
    (CATALOG_STATUSES as string[]).includes(s),
  );

  const themes = sp.get("theme")?.split(",").filter(Boolean) ?? [];
  f.themes = themes;

  const readNum = (key: string) => {
    const v = sp.get(key);
    if (v == null || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  f.yearMin = readNum("yrMin");
  f.yearMax = readNum("yrMax");
  f.priceMin = readNum("pMin");
  f.priceMax = readNum("pMax");
  f.partsMin = readNum("ptMin");
  f.partsMax = readNum("ptMax");

  const sort = sp.get("sort") as CatalogFilters["sort"] | null;
  if (sort) f.sort = sort;

  return f;
}

function filtersToSearchParams(f: CatalogFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.statuses.length) p.set("status", f.statuses.join(","));
  if (f.themes.length) p.set("theme", f.themes.join(","));
  if (f.yearMin != null) p.set("yrMin", String(f.yearMin));
  if (f.yearMax != null) p.set("yrMax", String(f.yearMax));
  if (f.priceMin != null) p.set("pMin", String(f.priceMin));
  if (f.priceMax != null) p.set("pMax", String(f.priceMax));
  if (f.partsMin != null) p.set("ptMin", String(f.partsMin));
  if (f.partsMax != null) p.set("ptMax", String(f.partsMax));
  if (f.sort !== "trending") p.set("sort", f.sort);
  return p;
}
