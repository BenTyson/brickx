"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { DeltaChip } from "@/components/ui/delta-chip";
import { Sparkline } from "@/components/charts/sparkline";
import {
  trendingGainers,
  trendingLosers,
  type TrendPeriod,
  type TrendRow,
} from "@/lib/mock/indices";

const PERIODS: Array<{ key: TrendPeriod; label: string }> = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
];

interface TrendingTableProps {
  defaultPeriod?: TrendPeriod;
  showLosers?: boolean;
  className?: string;
}

export function TrendingTable({
  defaultPeriod = "30d",
  showLosers = true,
  className,
}: TrendingTableProps) {
  const [period, setPeriod] = useState<TrendPeriod>(defaultPeriod);
  const gainers = trendingGainers(period, 12);
  const losers = trendingLosers(period, 8);

  return (
    <section className={cn("rounded-2xl border border-border-thin bg-bg-raised", className)}>
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border-thin px-5 py-4 sm:px-6">
        <div>
          <div className="text-micro font-mono font-tabular text-text-tertiary">Trending</div>
          <div className="mt-1 font-serif-display text-[22px] leading-tight text-text-primary">
            Gainers &amp; losers.
          </div>
        </div>
        <div className="flex items-center gap-0.5 rounded-full border border-border-thin bg-bg-overlay p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key)}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-mono font-tabular uppercase tracking-[0.08em] transition",
                period === p.key
                  ? "bg-accent text-accent-foreground"
                  : "text-text-tertiary hover:text-text-primary",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className={cn("grid gap-0", showLosers && "sm:grid-cols-2")}>
        <TrendColumn title="Gainers" tone="success" rows={gainers} period={period} />
        {showLosers && (
          <TrendColumn
            title="Losers"
            tone="danger"
            rows={losers}
            period={period}
            className="border-t border-border-thin sm:border-l sm:border-t-0"
          />
        )}
      </div>
    </section>
  );
}

function TrendColumn({
  title,
  tone,
  rows,
  period,
  className,
}: {
  title: string;
  tone: "success" | "danger";
  rows: TrendRow[];
  period: TrendPeriod;
  className?: string;
}) {
  return (
    <div className={className}>
      {/* Column header */}
      <div className="flex items-center gap-2 border-b border-border-thin px-5 py-2.5 sm:px-6">
        <div
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "success" ? "bg-success" : "bg-danger",
          )}
        />
        <span
          className={cn(
            "text-micro font-mono font-tabular uppercase tracking-[0.08em]",
            tone === "success" ? "text-success" : "text-danger",
          )}
        >
          {title}
        </span>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[2rem_minmax(0,1fr)_5rem_4.5rem_5rem] items-center gap-2 border-b border-border-thin bg-bg-overlay px-5 py-1.5 text-micro font-mono font-tabular text-text-quaternary sm:px-6">
        <span>#</span>
        <span>Set</span>
        <span className="text-right">Price</span>
        <span className="text-right">{period}</span>
        <span className="text-right">Volume</span>
      </div>

      {/* Rows */}
      <ul className="divide-y divide-[var(--border-thin)]">
        {rows.map((row) => (
          <li key={row.set.id}>
            <Link
              href={`/demo/sets/${row.set.id}`}
              className="group grid grid-cols-[2rem_minmax(0,1fr)_5rem_4.5rem_5rem] items-center gap-2 px-5 py-2.5 transition hover:bg-bg-overlay sm:px-6"
            >
              <span className="font-mono font-tabular text-micro tabular-nums text-text-quaternary">
                {row.rank}
              </span>
              <div className="flex min-w-0 items-center gap-2">
                <Sparkline
                  data={row.sparkline}
                  width={48}
                  height={18}
                  tone={tone}
                  showEndDot={false}
                  area={false}
                />
                <span className="min-w-0 truncate text-small text-text-primary transition group-hover:text-accent-hover">
                  {row.set.name}
                </span>
              </div>
              <span className="text-right font-mono font-tabular text-small tabular-nums text-text-primary">
                ${row.set.currentValue.toLocaleString()}
              </span>
              <span className="flex justify-end">
                <DeltaChip value={row.delta} size="sm" hideIcon />
              </span>
              <span className="text-right font-mono font-tabular text-micro tabular-nums text-text-tertiary">
                {row.volume}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
