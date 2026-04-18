"use client";

import { PriceChartV2 } from "@/components/charts/price-chart-v2";
import type { DatedPoint, PriceChartEvent } from "@/lib/mock/series";

interface PriceHistoryChartProps {
  series: DatedPoint[];
  usedSeries?: DatedPoint[];
  sources?: Partial<
    Record<"bricklink" | "brickowl" | "brickeconomy", DatedPoint[]>
  >;
  events?: PriceChartEvent[];
}

/**
 * Section wrapper around PriceChartV2 — adds editorial header,
 * range/series chips live inside the chart itself.
 */
export function PriceHistoryChart({
  series,
  usedSeries,
  sources,
  events,
}: PriceHistoryChartProps) {
  return (
    <section
      aria-labelledby="price-history"
      className="space-y-6 rounded-2xl border border-border-thin bg-card p-6 lg:p-8"
    >
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
            01 · Price history
          </div>
          <h2
            id="price-history"
            className="mt-2 text-h3 font-medium tracking-tight text-text-primary"
          >
            Blended market value over time
          </h2>
        </div>
        <p className="max-w-md text-small text-text-tertiary">
          Sourced from BrickLink, BrickOwl, and BrickEconomy with a 0.50 / 0.30
          / 0.20 weighting. Toggle sources below to compare.
        </p>
      </header>
      <PriceChartV2
        series={series}
        usedSeries={usedSeries}
        sources={sources}
        events={events}
        defaultRange="1Y"
        height={380}
      />
    </section>
  );
}
