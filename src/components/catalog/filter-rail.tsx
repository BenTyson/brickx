"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { SetStatus } from "@/lib/types/database";
import { DualRangeSlider } from "./dual-range-slider";

export type CatalogFiltersState = {
  q?: string;
  statuses: SetStatus[];
  themeIds: number[];
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  partsMin?: number;
  partsMax?: number;
  sort: string;
};

export interface ThemeOption {
  id: number;
  name: string;
  count: number;
}

const STATUS_LABEL: Record<SetStatus, string> = {
  available: "Available",
  retired: "Retired",
  unreleased: "Unreleased",
};

const CATALOG_STATUSES: SetStatus[] = ["available", "retired", "unreleased"];

interface FilterRailProps {
  filters: CatalogFiltersState;
  resultCount: number;
  themeOptions: ThemeOption[];
  yearRange: [number, number];
  priceRange: [number, number];
  partsRange: [number, number];
  onChange: (patch: Partial<CatalogFiltersState>) => void;
  onClearAll: () => void;
}

export function FilterRail({
  filters,
  resultCount,
  themeOptions,
  yearRange,
  priceRange,
  partsRange,
  onChange,
  onClearAll,
}: FilterRailProps) {
  const [themeQuery, setThemeQuery] = useState("");

  const themes = useMemo(() => {
    const q = themeQuery.trim().toLowerCase();
    if (!q) return themeOptions;
    return themeOptions.filter((t) => t.name.toLowerCase().includes(q));
  }, [themeQuery, themeOptions]);

  const hasAny =
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

  const yearVal: [number, number] = [
    filters.yearMin ?? yearRange[0],
    filters.yearMax ?? yearRange[1],
  ];
  const priceVal: [number, number] = [
    filters.priceMin ?? priceRange[0],
    filters.priceMax ?? priceRange[1],
  ];
  const partsVal: [number, number] = [
    filters.partsMin ?? partsRange[0],
    filters.partsMax ?? partsRange[1],
  ];

  return (
    <aside
      aria-label="Filters"
      className="flex w-full flex-col gap-8 rounded-2xl border border-border-thin bg-card p-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:w-[280px] lg:overflow-y-auto"
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            Filters
          </div>
          <div className="mt-1 text-sm font-mono font-tabular tabular-nums text-text-primary">
            {resultCount.toLocaleString()} sets
          </div>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          disabled={!hasAny}
          className="text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary transition enabled:hover:text-text-primary disabled:opacity-30"
        >
          Clear all
        </button>
      </header>

      <Section title="Status">
        <div className="flex flex-wrap gap-1.5">
          {CATALOG_STATUSES.map((s) => {
            const active = filters.statuses.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange({
                    statuses: active
                      ? filters.statuses.filter((x) => x !== s)
                      : [...filters.statuses, s],
                  })
                }
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-mono font-tabular uppercase tracking-[0.06em] transition",
                  active
                    ? "border-accent bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-text-primary"
                    : "border-border-thin bg-bg-raised text-text-tertiary hover:border-border-emphasis hover:text-text-secondary",
                )}
              >
                {STATUS_LABEL[s]}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Theme">
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-text-tertiary" />
          <input
            value={themeQuery}
            onChange={(e) => setThemeQuery(e.target.value)}
            placeholder="Search themes"
            aria-label="Search themes"
            className="h-8 w-full rounded-md border border-border-thin bg-bg-raised pl-8 pr-2 text-small text-text-primary placeholder:text-text-tertiary focus:border-border-emphasis focus:outline-none"
          />
        </div>
        <ul className="flex max-h-56 flex-col gap-0.5 overflow-y-auto pr-1">
          {themes.map((t) => (
            <ThemeRow
              key={t.id}
              theme={t}
              active={filters.themeIds.includes(t.id)}
              onToggle={() =>
                onChange({
                  themeIds: filters.themeIds.includes(t.id)
                    ? filters.themeIds.filter((x) => x !== t.id)
                    : [...filters.themeIds, t.id],
                })
              }
            />
          ))}
          {themes.length === 0 && (
            <li className="py-3 text-center text-micro font-mono text-text-tertiary">
              No themes match.
            </li>
          )}
        </ul>
      </Section>

      <Section title="Year">
        <DualRangeSlider
          min={yearRange[0]}
          max={yearRange[1]}
          value={yearVal}
          onChange={([lo, hi]) =>
            onChange({
              yearMin: lo === yearRange[0] ? undefined : lo,
              yearMax: hi === yearRange[1] ? undefined : hi,
            })
          }
          format={(n) => String(n)}
          ariaLabelLow="Minimum year"
          ariaLabelHigh="Maximum year"
        />
      </Section>

      <Section title="MSRP">
        <DualRangeSlider
          min={priceRange[0]}
          max={priceRange[1]}
          step={10}
          value={priceVal}
          onChange={([lo, hi]) =>
            onChange({
              priceMin: lo === priceRange[0] ? undefined : lo,
              priceMax: hi === priceRange[1] ? undefined : hi,
            })
          }
          format={(n) => `$${n.toLocaleString()}`}
          ariaLabelLow="Minimum MSRP"
          ariaLabelHigh="Maximum MSRP"
        />
      </Section>

      <Section title="Piece count">
        <DualRangeSlider
          min={partsRange[0]}
          max={partsRange[1]}
          step={100}
          value={partsVal}
          onChange={([lo, hi]) =>
            onChange({
              partsMin: lo === partsRange[0] ? undefined : lo,
              partsMax: hi === partsRange[1] ? undefined : hi,
            })
          }
          format={(n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n))}
          ariaLabelLow="Minimum pieces"
          ariaLabelHigh="Maximum pieces"
        />
      </Section>
    </aside>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
        {title}
      </h3>
      {children}
    </section>
  );
}

function ThemeRow({
  theme,
  active,
  onToggle,
}: {
  theme: ThemeOption;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={active}
        className={cn(
          "group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-small transition",
          active
            ? "bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-text-primary"
            : "text-text-secondary hover:bg-bg-raised hover:text-text-primary",
        )}
      >
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className={cn(
              "inline-flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border transition",
              active
                ? "border-accent bg-accent"
                : "border-border-emphasis bg-transparent",
            )}
          >
            {active && (
              <svg viewBox="0 0 12 12" className="size-2 text-accent-foreground">
                <path
                  d="M2 6.5l2.5 2.5L10 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span className="truncate">{theme.name}</span>
        </span>
        <span className="text-micro font-mono font-tabular text-text-tertiary">
          {theme.count.toLocaleString()}
        </span>
      </button>
    </li>
  );
}

export function FilterChipClear() {
  return <X className="size-3" />;
}
