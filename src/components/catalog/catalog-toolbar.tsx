"use client";

import { LayoutGrid, List, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CATALOG_SORTS } from "@/lib/view-models/catalog";
import type { CatalogFiltersState } from "./filter-rail";

export type CatalogView = "grid" | "list";

interface CatalogToolbarProps {
  filters: CatalogFiltersState;
  view: CatalogView;
  resultCount: number;
  onChange: (patch: Partial<CatalogFiltersState>) => void;
  onViewChange: (v: CatalogView) => void;
  onOpenPalette?: () => void;
  className?: string;
}

export function CatalogToolbar({
  filters,
  view,
  resultCount,
  onChange,
  onViewChange,
  onOpenPalette,
  className,
}: CatalogToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="relative flex-1 min-w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary" />
        <input
          value={filters.q ?? ""}
          onChange={(e) => onChange({ q: e.target.value || undefined })}
          placeholder="Search by name or set number"
          aria-label="Search catalog"
          className="h-10 w-full rounded-md border border-border-thin bg-bg-raised pl-9 pr-24 text-small text-text-primary placeholder:text-text-tertiary focus:border-border-emphasis focus:outline-none"
        />
        {onOpenPalette && (
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open command palette"
            className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded border border-border-thin bg-bg-base px-1.5 py-0.5 text-[10px] font-mono font-tabular text-text-tertiary transition hover:text-text-primary"
          >
            <span>⌘K</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="catalog-sort">
          Sort
        </label>
        <select
          id="catalog-sort"
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value })}
          className="h-10 rounded-md border border-border-thin bg-bg-raised px-3 text-small text-text-primary focus:border-border-emphasis focus:outline-none"
        >
          {CATALOG_SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>

        <div
          role="group"
          aria-label="View toggle"
          className="flex items-center rounded-md border border-border-thin bg-bg-raised p-0.5"
        >
          <ToggleButton
            active={view === "grid"}
            onClick={() => onViewChange("grid")}
            label="Grid view"
          >
            <LayoutGrid className="size-4" />
          </ToggleButton>
          <ToggleButton
            active={view === "list"}
            onClick={() => onViewChange("list")}
            label="List view"
          >
            <List className="size-4" />
          </ToggleButton>
        </div>
      </div>

      <div className="w-full sm:w-auto sm:ml-auto sm:text-right">
        <span className="text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
          {resultCount.toLocaleString()} results
        </span>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded transition",
        active
          ? "bg-bg-overlay text-text-primary"
          : "text-text-tertiary hover:text-text-primary",
      )}
    >
      {children}
    </button>
  );
}
