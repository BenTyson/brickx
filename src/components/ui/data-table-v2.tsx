"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type DataTableColumn<Row> = {
  /** Stable key. */
  key: string;
  /** Header label. */
  header: ReactNode;
  /** Cell renderer. */
  cell: (row: Row, index: number) => ReactNode;
  /** Enable sorting with this comparator (a, b) => number. */
  sort?: (a: Row, b: Row) => number;
  /** Render right-aligned for numerics. */
  align?: "left" | "right" | "center";
  /** Explicit column width. */
  width?: number | string;
  /** Tailwind classes for the cells in this column. */
  cellClassName?: string;
  /** Tailwind classes for the header cell. */
  headerClassName?: string;
};

interface DataTableV2Props<Row> {
  columns: DataTableColumn<Row>[];
  data: Row[];
  /** Row key resolver. */
  getRowKey?: (row: Row, index: number) => string | number;
  /** Optional click handler. */
  onRowClick?: (row: Row) => void;
  /** Show skeleton pulse rows instead of data. */
  loading?: boolean;
  skeletonRows?: number;
  /** Sticky header offset (px). Default 0. */
  stickyOffset?: number;
  className?: string;
  /** Empty state slot. */
  empty?: ReactNode;
}

/**
 * DataTable v2 — no zebra stripes, hairline borders only, sticky header,
 * monospace numerics, row hover glow, skeleton pulse loading.
 */
export function DataTableV2<Row>({
  columns,
  data,
  getRowKey,
  onRowClick,
  loading,
  skeletonRows = 6,
  stickyOffset = 0,
  className,
  empty,
}: DataTableV2Props<Row>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sort) return data;
    const cmp = col.sort;
    const copy = [...data];
    copy.sort((a, b) => (sortDir === "asc" ? cmp(a, b) : cmp(b, a)));
    return copy;
  }, [data, columns, sortKey, sortDir]);

  function requestSort(colKey: string) {
    const col = columns.find((c) => c.key === colKey);
    if (!col?.sort) return;
    if (sortKey === colKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(colKey);
      setSortDir("desc");
    }
  }

  return (
    <div className={cn("relative overflow-auto rounded-xl border border-border-thin", className)}>
      <table className="w-full border-collapse text-left">
        <thead
          className="sticky bg-card/80 backdrop-blur"
          style={{ top: stickyOffset }}
        >
          <tr className="border-b border-border-thin">
            {columns.map((col) => {
              const sortable = !!col.sort;
              const active = sortKey === col.key;
              const Icon = active
                ? sortDir === "asc"
                  ? ArrowUp
                  : ArrowDown
                : ChevronsUpDown;
              return (
                <th
                  key={col.key}
                  scope="col"
                  style={{ width: col.width }}
                  className={cn(
                    "text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary",
                    "px-4 py-3 font-normal",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.headerClassName,
                  )}
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() => requestSort(col.key)}
                      className={cn(
                        "inline-flex items-center gap-1 transition hover:text-text-primary",
                        col.align === "right" && "flex-row-reverse",
                        active && "text-text-primary",
                      )}
                    >
                      <span>{col.header}</span>
                      <Icon className="size-3 opacity-60" />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, r) => (
              <tr key={`sk-${r}`} className="border-b border-border-thin">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3", col.cellClassName)}
                  >
                    <span
                      className="skeleton-shimmer block h-3 w-full rounded-sm"
                      style={{ maxWidth: "80%" }}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : sorted.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-small text-text-tertiary"
              >
                {empty ?? "No results."}
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr
                key={getRowKey ? getRowKey(row, i) : i}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "group border-b border-border-thin transition-colors last:border-b-0",
                  "hover:bg-[color-mix(in_oklab,var(--accent)_4%,transparent)]",
                  onRowClick && "cursor-pointer",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 align-middle text-small text-text-secondary",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.cellClassName,
                    )}
                  >
                    {col.cell(row, i)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
