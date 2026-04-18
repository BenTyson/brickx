"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  CATALOG_STATUSES,
  CATALOG_THEMES,
  PARTS_RANGE,
  PRICE_RANGE,
  YEAR_RANGE,
  type CatalogFilters,
  type SetStatus,
  type Theme,
} from "@/lib/mock/catalog";
import { DualRangeSlider } from "./dual-range-slider";

const STATUS_LABEL: Record<SetStatus, string> = {
  available: "Available",
  retired: "Retired",
  "retiring-soon": "Retiring soon",
  exclusive: "Exclusive",
  unreleased: "Unreleased",
};

interface FilterRailProps {
  filters: CatalogFilters;
  resultCount: number;
  onChange: (patch: Partial<CatalogFilters>) => void;
  onClearAll: () => void;
}

export function FilterRail({
  filters,
  resultCount,
  onChange,
  onClearAll,
}: FilterRailProps) {
  const [themeQuery, setThemeQuery] = useState("");

  const themes = useMemo(() => {
    const q = themeQuery.trim().toLowerCase();
    if (!q) return CATALOG_THEMES;
    return CATALOG_THEMES.filter((t) => t.name.toLowerCase().includes(q));
  }, [themeQuery]);

  const hasAny =
    (filters.statuses.length ?? 0) +
      (filters.themes.length ?? 0) +
      (filters.q ? 1 : 0) +
      (filters.yearMin != null ? 1 : 0) +
      (filters.yearMax != null ? 1 : 0) +
      (filters.priceMin != null ? 1 : 0) +
      (filters.priceMax != null ? 1 : 0) +
      (filters.partsMin != null ? 1 : 0) +
      (filters.partsMax != null ? 1 : 0) >
    0;

  const yearVal: [number, number] = [
    filters.yearMin ?? YEAR_RANGE[0],
    filters.yearMax ?? YEAR_RANGE[1],
  ];
  const priceVal: [number, number] = [
    filters.priceMin ?? PRICE_RANGE[0],
    filters.priceMax ?? PRICE_RANGE[1],
  ];
  const partsVal: [number, number] = [
    filters.partsMin ?? PARTS_RANGE[0],
    filters.partsMax ?? PARTS_RANGE[1],
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
              key={t.slug}
              theme={t}
              active={filters.themes.includes(t.slug)}
              onToggle={() =>
                onChange({
                  themes: filters.themes.includes(t.slug)
                    ? filters.themes.filter((x) => x !== t.slug)
                    : [...filters.themes, t.slug],
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
          min={YEAR_RANGE[0]}
          max={YEAR_RANGE[1]}
          value={yearVal}
          onChange={([lo, hi]) =>
            onChange({
              yearMin: lo === YEAR_RANGE[0] ? undefined : lo,
              yearMax: hi === YEAR_RANGE[1] ? undefined : hi,
            })
          }
          format={(n) => String(n)}
          ariaLabelLow="Minimum year"
          ariaLabelHigh="Maximum year"
        />
      </Section>

      <Section title="Market value">
        <DualRangeSlider
          min={PRICE_RANGE[0]}
          max={PRICE_RANGE[1]}
          step={10}
          value={priceVal}
          onChange={([lo, hi]) =>
            onChange({
              priceMin: lo === PRICE_RANGE[0] ? undefined : lo,
              priceMax: hi === PRICE_RANGE[1] ? undefined : hi,
            })
          }
          format={(n) => `$${n.toLocaleString()}`}
          ariaLabelLow="Minimum price"
          ariaLabelHigh="Maximum price"
        />
      </Section>

      <Section title="Piece count">
        <DualRangeSlider
          min={PARTS_RANGE[0]}
          max={PARTS_RANGE[1]}
          step={100}
          value={partsVal}
          onChange={([lo, hi]) =>
            onChange({
              partsMin: lo === PARTS_RANGE[0] ? undefined : lo,
              partsMax: hi === PARTS_RANGE[1] ? undefined : hi,
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
  theme: Theme;
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
          {theme.setCount}
        </span>
      </button>
    </li>
  );
}

/** Inline pill used by active-filter bar to clear an individual chip. */
export function FilterChipClear() {
  return <X className="size-3" />;
}
