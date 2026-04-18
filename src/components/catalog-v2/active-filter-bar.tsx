"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  CATALOG_THEMES,
  PARTS_RANGE,
  PRICE_RANGE,
  YEAR_RANGE,
  type CatalogFilters,
  type SetStatus,
} from "@/lib/mock/catalog";

const STATUS_LABEL: Record<SetStatus, string> = {
  available: "Available",
  retired: "Retired",
  "retiring-soon": "Retiring soon",
  exclusive: "Exclusive",
  unreleased: "Unreleased",
};

interface Chip {
  id: string;
  label: string;
  clear: () => void;
}

interface ActiveFilterBarProps {
  filters: CatalogFilters;
  onChange: (patch: Partial<CatalogFilters>) => void;
  onClearAll: () => void;
  className?: string;
}

export function ActiveFilterBar({
  filters,
  onChange,
  onClearAll,
  className,
}: ActiveFilterBarProps) {
  const chips: Chip[] = [];

  if (filters.q) {
    chips.push({
      id: "q",
      label: `"${filters.q}"`,
      clear: () => onChange({ q: undefined }),
    });
  }
  for (const s of filters.statuses) {
    chips.push({
      id: `status-${s}`,
      label: STATUS_LABEL[s],
      clear: () =>
        onChange({ statuses: filters.statuses.filter((x) => x !== s) }),
    });
  }
  for (const slug of filters.themes) {
    const theme = CATALOG_THEMES.find((t) => t.slug === slug);
    chips.push({
      id: `theme-${slug}`,
      label: theme?.name ?? slug,
      clear: () => onChange({ themes: filters.themes.filter((x) => x !== slug) }),
    });
  }
  if (filters.yearMin != null || filters.yearMax != null) {
    const lo = filters.yearMin ?? YEAR_RANGE[0];
    const hi = filters.yearMax ?? YEAR_RANGE[1];
    chips.push({
      id: "year",
      label: `${lo}–${hi}`,
      clear: () => onChange({ yearMin: undefined, yearMax: undefined }),
    });
  }
  if (filters.priceMin != null || filters.priceMax != null) {
    const lo = filters.priceMin ?? PRICE_RANGE[0];
    const hi = filters.priceMax ?? PRICE_RANGE[1];
    chips.push({
      id: "price",
      label: `$${lo}–$${hi}`,
      clear: () => onChange({ priceMin: undefined, priceMax: undefined }),
    });
  }
  if (filters.partsMin != null || filters.partsMax != null) {
    const lo = filters.partsMin ?? PARTS_RANGE[0];
    const hi = filters.partsMax ?? PARTS_RANGE[1];
    chips.push({
      id: "parts",
      label: `${lo.toLocaleString()}–${hi.toLocaleString()} pcs`,
      clear: () => onChange({ partsMin: undefined, partsMax: undefined }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-quaternary">
        Active
      </span>
      {chips.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={c.clear}
          className="group inline-flex items-center gap-1.5 rounded-full border border-border-thin bg-bg-raised px-2.5 py-1 text-[12px] text-text-secondary transition hover:border-border-emphasis hover:text-text-primary"
        >
          <span>{c.label}</span>
          <X className="size-3 text-text-tertiary transition group-hover:text-text-primary" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary underline-offset-2 transition hover:text-text-primary hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
