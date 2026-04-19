"use client";

import { PriceChartV2 } from "@/components/charts/price-chart-v2";
import type { DatedPoint, PriceChartEvent } from "@/lib/mock/series";
import type { PriceHistoryPoint } from "@/lib/types/catalog";

interface PriceHistoryChartProps {
  priceHistory: PriceHistoryPoint[];
  events?: PriceChartEvent[];
}

/**
 * Section wrapper around PriceChartV2. Accepts raw PriceHistoryPoint[] from
 * the DB and aggregates them into a blended `new` series, a `used` series,
 * and per-source overlays.
 */
export function PriceHistoryChart({
  priceHistory,
  events,
}: PriceHistoryChartProps) {
  const { newSeries, usedSeries, sources } = aggregatePriceHistory(priceHistory);

  if (newSeries.length === 0 && usedSeries.length === 0) {
    return (
      <section className="space-y-4 rounded-2xl border border-border-thin bg-card p-6 lg:p-8">
        <header>
          <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
            01 · Price history
          </div>
          <h2 className="mt-2 text-h3 font-medium tracking-tight text-text-primary">
            Blended market value over time
          </h2>
        </header>
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border-thin text-small text-text-tertiary">
          Not enough price data yet — we refresh every six hours.
        </div>
      </section>
    );
  }

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
        series={newSeries}
        usedSeries={usedSeries.length ? usedSeries : undefined}
        sources={sources}
        events={events}
        defaultRange="1Y"
        height={380}
      />
    </section>
  );
}

function aggregatePriceHistory(rows: PriceHistoryPoint[]) {
  const newByDate = new Map<string, number[]>();
  const usedByDate = new Map<string, number[]>();
  const sourceMap: Record<string, Map<string, number>> = {
    bricklink: new Map(),
    brickowl: new Map(),
    brickeconomy: new Map(),
  };

  for (const row of rows) {
    const date = row.date.slice(0, 10);
    if (row.new_avg != null) {
      const arr = newByDate.get(date) ?? [];
      arr.push(row.new_avg);
      newByDate.set(date, arr);

      const source = row.source?.toLowerCase();
      if (source && source in sourceMap) {
        sourceMap[source].set(date, row.new_avg);
      }
    }
    if (row.used_avg != null) {
      const arr = usedByDate.get(date) ?? [];
      arr.push(row.used_avg);
      usedByDate.set(date, arr);
    }
  }

  const reduce = (
    m: Map<string, number[]>,
  ): DatedPoint[] =>
    Array.from(m.entries())
      .map(([date, vals]) => ({
        date,
        v: Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)),
      }))
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const reduceSingle = (m: Map<string, number>): DatedPoint[] =>
    Array.from(m.entries())
      .map(([date, v]) => ({ date, v: Number(v.toFixed(2)) }))
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  return {
    newSeries: reduce(newByDate),
    usedSeries: reduce(usedByDate),
    sources: {
      bricklink: reduceSingle(sourceMap.bricklink),
      brickowl: reduceSingle(sourceMap.brickowl),
      brickeconomy: reduceSingle(sourceMap.brickeconomy),
    },
  };
}
