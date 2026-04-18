"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DataTableV2, type DataTableColumn } from "@/components/ui/data-table-v2";
import { Sparkline } from "@/components/charts/sparkline";
import { DeltaChip } from "@/components/ui/delta-chip";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils/cn";
import type { Holding } from "@/lib/mock/portfolio";

interface HoldingsTableProps {
  holdings: Holding[];
  /** Prefix for the set detail link href (default /demo/sets). */
  setHrefPrefix?: string;
  className?: string;
}

export function HoldingsTable({
  holdings,
  setHrefPrefix = "/demo/sets",
  className,
}: HoldingsTableProps) {
  const [q, setQ] = useState("");
  const [themeFilter, setThemeFilter] = useState<string | null>(null);

  const themes = useMemo(() => {
    const set = new Set<string>();
    for (const h of holdings) set.add(h.set.theme);
    return [...set].sort();
  }, [holdings]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return holdings.filter((h) => {
      if (themeFilter && h.set.theme !== themeFilter) return false;
      if (!needle) return true;
      const hay = `${h.set.name} ${h.set.id} ${h.set.theme}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [holdings, q, themeFilter]);

  const columns: DataTableColumn<Holding>[] = [
    {
      key: "set",
      header: "Set",
      cell: (h) => (
        <div className="flex items-center gap-3 min-w-0">
          <SetThumb h={h} />
          <div className="min-w-0">
            <Link
              href={`${setHrefPrefix}/${h.set.id}`}
              className="block truncate text-small text-text-primary transition hover:text-accent-hover"
            >
              {h.set.name}
            </Link>
            <div className="mt-0.5 flex items-center gap-2 text-micro font-mono font-tabular tabular-nums text-text-tertiary">
              <span>#{h.set.id}</span>
              <span>·</span>
              <span>{h.set.theme}</span>
            </div>
          </div>
        </div>
      ),
      sort: (a, b) => a.set.name.localeCompare(b.set.name),
    },
    {
      key: "status",
      header: "Status",
      cell: (h) => <StatusBadge status={h.set.status} />,
      width: 120,
    },
    {
      key: "qty",
      header: "Qty",
      align: "right",
      width: 64,
      cell: (h) => (
        <span className="font-mono font-tabular tabular-nums text-text-secondary">
          {h.qty}
        </span>
      ),
      sort: (a, b) => a.qty - b.qty,
    },
    {
      key: "cost",
      header: "Cost",
      align: "right",
      width: 90,
      cell: (h) => (
        <span className="font-mono font-tabular tabular-nums text-text-tertiary">
          ${h.costBasisPerUnit.toFixed(0)}
        </span>
      ),
      sort: (a, b) => a.costBasisPerUnit - b.costBasisPerUnit,
    },
    {
      key: "current",
      header: "Current",
      align: "right",
      width: 100,
      cell: (h) => (
        <span className="font-mono font-tabular tabular-nums text-text-primary">
          ${h.set.currentValue.toFixed(0)}
        </span>
      ),
      sort: (a, b) => a.set.currentValue - b.set.currentValue,
    },
    {
      key: "gain",
      header: "Gain",
      align: "right",
      width: 110,
      cell: (h) => {
        const gain = (h.set.currentValue - h.costBasisPerUnit) * h.qty;
        return (
          <span
            className={cn(
              "font-mono font-tabular tabular-nums",
              gain >= 0 ? "text-success" : "text-danger",
            )}
          >
            {gain >= 0 ? "+" : "−"}${Math.abs(gain).toFixed(0)}
          </span>
        );
      },
      sort: (a, b) =>
        (a.set.currentValue - a.costBasisPerUnit) * a.qty -
        (b.set.currentValue - b.costBasisPerUnit) * b.qty,
    },
    {
      key: "gainPct",
      header: "Gain %",
      align: "right",
      width: 96,
      cell: (h) => {
        const pct =
          ((h.set.currentValue - h.costBasisPerUnit) /
            Math.max(h.costBasisPerUnit, 1)) *
          100;
        return <DeltaChip value={pct} size="sm" hideIcon />;
      },
      sort: (a, b) => {
        const pa = (a.set.currentValue - a.costBasisPerUnit) / Math.max(a.costBasisPerUnit, 1);
        const pb = (b.set.currentValue - b.costBasisPerUnit) / Math.max(b.costBasisPerUnit, 1);
        return pa - pb;
      },
    },
    {
      key: "spark",
      header: "30d",
      width: 100,
      cell: (h) => (
        <Sparkline data={h.sparkline30d} width={84} height={22} className="w-full" />
      ),
    },
  ];

  return (
    <section
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border-thin bg-bg-raised p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            Holdings
          </div>
          <div className="mt-1 font-serif-display text-[22px] leading-tight text-text-primary">
            The ledger.
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-text-tertiary"
              strokeWidth={2}
              aria-hidden
            />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search holdings"
              className="h-8 w-48 rounded-full border border-border-thin bg-bg-overlay pl-8 pr-3 text-small text-text-primary placeholder:text-text-tertiary focus:border-border-emphasis focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border-thin bg-bg-overlay p-1">
            <button
              type="button"
              onClick={() => setThemeFilter(null)}
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-mono font-tabular uppercase tracking-[0.08em] transition",
                themeFilter === null
                  ? "bg-accent text-accent-foreground"
                  : "text-text-tertiary hover:text-text-primary",
              )}
            >
              All
            </button>
            {themes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setThemeFilter((curr) => (curr === t ? null : t))}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[11px] font-mono font-tabular uppercase tracking-[0.08em] transition",
                  themeFilter === t
                    ? "bg-accent text-accent-foreground"
                    : "text-text-tertiary hover:text-text-primary",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <DataTableV2
        columns={columns}
        data={filtered}
        getRowKey={(h) => h.set.id}
        empty="No holdings match the current filters."
      />
    </section>
  );
}

function SetThumb({ h }: { h: Holding }) {
  const initials = h.set.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      aria-hidden
      className="flex size-9 shrink-0 items-center justify-center rounded bg-bg-overlay text-[10px] font-mono font-tabular tracking-[0.08em] text-text-tertiary"
    >
      {initials}
    </div>
  );
}
