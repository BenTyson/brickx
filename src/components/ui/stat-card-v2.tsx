"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { CountUp } from "@/components/motion/count-up";
import { Sparkline } from "@/components/charts/sparkline";
import { DeltaChip } from "@/components/ui/delta-chip";
import type { SeriesPoint } from "@/lib/mock/series";

type RangeKey = "1M" | "3M" | "1Y";

interface StatCardV2Props {
  /** Small all-caps label above the value. */
  label: string;
  /** Numeric value for count-up. */
  value: number;
  /** Value prefix (e.g. "$"). */
  prefix?: string;
  /** Value suffix (e.g. "%"). */
  suffix?: string;
  /** Decimal places. Default 0. */
  decimals?: number;
  /** 30/60/90-day series for the body sparkline. */
  series?: SeriesPoint[] | number[];
  /** Delta in percent over the default range (matches series). */
  delta?: number;
  /** Optional short descriptor shown next to the delta, e.g. "past 90 days". */
  deltaLabel?: string;
  /** Additional by-range series for hover tooltip toggles. */
  ranges?: Partial<Record<RangeKey, { value: number; delta: number }>>;
  /** Density — compact drops vertical spacing. */
  density?: "default" | "compact";
  className?: string;
}

/**
 * StatCard v2 — label + oversized count-up value + in-card sparkline + delta chip.
 * Hover reveals a micro range toggle (1M/3M/1Y) when ranges provided.
 */
export function StatCardV2({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  series,
  delta,
  deltaLabel,
  ranges,
  density = "default",
  className,
}: StatCardV2Props) {
  const [range, setRange] = useState<RangeKey | null>(null);
  const activeValue = range && ranges?.[range] ? ranges[range]!.value : value;
  const activeDelta = range && ranges?.[range] ? ranges[range]!.delta : delta;

  return (
    <div
      className={cn(
        "group bg-card relative overflow-hidden rounded-xl border border-border-thin transition",
        "hover:border-border-emphasis",
        density === "compact" ? "p-4" : "p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="text-micro font-mono font-tabular text-text-tertiary">
          {label}
        </div>
        {ranges && (
          <div className="flex opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            {(["1M", "3M", "1Y"] as RangeKey[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange((curr) => (curr === r ? null : r))}
                className={cn(
                  "text-[10px] font-mono font-tabular px-1.5 py-0.5 rounded transition",
                  range === r
                    ? "bg-accent text-accent-foreground"
                    : "text-text-tertiary hover:text-text-secondary",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        {prefix && (
          <span className="text-text-tertiary font-mono font-tabular text-2xl">
            {prefix}
          </span>
        )}
        <CountUp
          value={activeValue}
          decimals={decimals}
          suffix={suffix}
          className={cn(
            "font-mono font-tabular text-text-primary tracking-tight tabular-nums",
            density === "compact" ? "text-3xl" : "text-4xl",
          )}
        />
      </div>

      {(activeDelta !== undefined || deltaLabel) && (
        <div className="mt-3 flex items-center gap-2">
          {activeDelta !== undefined && (
            <DeltaChip value={activeDelta} size="sm" />
          )}
          {deltaLabel && (
            <span className="text-micro text-text-tertiary">{deltaLabel}</span>
          )}
        </div>
      )}

      {series && series.length > 1 && (
        <div className="mt-5">
          <Sparkline
            data={series}
            width={260}
            height={40}
            strokeWidth={1.5}
            className="w-full"
            ariaLabel={`${label} sparkline`}
          />
        </div>
      )}
    </div>
  );
}
