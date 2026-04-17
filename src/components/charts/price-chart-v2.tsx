"use client";

import { useMemo, useState, useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils/cn";
import type { DatedPoint, PriceChartEvent } from "@/lib/mock/series";

export type PriceSeriesKey = "new" | "used" | "bricklink" | "brickowl" | "brickeconomy";

interface PriceChartV2Props {
  /** Primary series (new condition). Required. */
  series: DatedPoint[];
  /** Optional companion series (used condition). */
  usedSeries?: DatedPoint[];
  /** Per-source series shown when their toggle is on. */
  sources?: Partial<Record<"bricklink" | "brickowl" | "brickeconomy", DatedPoint[]>>;
  /** Event annotations rendered as vertical reference lines + dots. */
  events?: PriceChartEvent[];
  /** Default range selection. */
  defaultRange?: "1M" | "3M" | "6M" | "1Y" | "ALL";
  height?: number;
  className?: string;
}

const RANGES = ["1M", "3M", "6M", "1Y", "ALL"] as const;
const RANGE_DAYS: Record<(typeof RANGES)[number], number | null> = {
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 365,
  ALL: null,
};

const SERIES_COLOR: Record<PriceSeriesKey, string> = {
  new: "var(--accent)",
  used: "var(--info)",
  bricklink: "var(--warning)",
  brickowl: "var(--success)",
  brickeconomy: "var(--danger)",
};
const SERIES_LABEL: Record<PriceSeriesKey, string> = {
  new: "New",
  used: "Used",
  bricklink: "BrickLink",
  brickowl: "BrickOwl",
  brickeconomy: "BrickEconomy",
};

function formatAxisDate(raw: string) {
  const d = new Date(raw);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}
function formatTooltipDate(raw: string) {
  const d = new Date(raw);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}
function formatPrice(v: number) {
  return `$${v.toFixed(0)}`;
}

/** Stitched point set — one row per date, one key per active series. */
type ChartRow = {
  date: string;
} & Partial<Record<PriceSeriesKey, number>>;

function stitch(
  bySeries: Partial<Record<PriceSeriesKey, DatedPoint[]>>,
): ChartRow[] {
  const dates = new Set<string>();
  for (const arr of Object.values(bySeries)) {
    if (!arr) continue;
    for (const p of arr) dates.add(p.date);
  }
  const sorted = [...dates].sort();
  const lookup: Partial<
    Record<PriceSeriesKey, Map<string, number>>
  > = {};
  for (const [k, arr] of Object.entries(bySeries) as [
    PriceSeriesKey,
    DatedPoint[] | undefined,
  ][]) {
    if (!arr) continue;
    lookup[k] = new Map(arr.map((p) => [p.date, p.v]));
  }
  return sorted.map((date) => {
    const row: ChartRow = { date };
    for (const k of Object.keys(bySeries) as PriceSeriesKey[]) {
      const v = lookup[k]?.get(date);
      if (v !== undefined) row[k] = v;
    }
    return row;
  });
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload?.length || !label) return null;
  return (
    <div className="rounded-md border border-border-emphasis bg-popover px-3 py-2 shadow-xl">
      <div className="text-micro font-mono font-tabular text-text-tertiary">
        {formatTooltipDate(label)}
      </div>
      <div className="mt-1.5 flex flex-col gap-1">
        {payload.map((p) => (
          <div
            key={p.dataKey}
            className="flex items-center justify-between gap-4 text-xs"
          >
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              {p.name}
            </span>
            <span className="font-mono font-tabular text-text-primary tabular-nums">
              ${p.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * PriceChart v2 — gradient area (stop-opacity 0.4→0), monotone bezier,
 * hairline crosshair, range chips, per-source toggles, event overlays.
 */
export function PriceChartV2({
  series,
  usedSeries,
  sources,
  events = [],
  defaultRange = "6M",
  height = 360,
  className,
}: PriceChartV2Props) {
  const gradId = useId();
  const [range, setRange] = useState<(typeof RANGES)[number]>(defaultRange);
  const [activeKeys, setActiveKeys] = useState<Set<PriceSeriesKey>>(() => {
    const s = new Set<PriceSeriesKey>(["new"]);
    if (usedSeries?.length) s.add("used");
    return s;
  });

  const filteredBy = useMemo(() => {
    const cutoff = RANGE_DAYS[range];
    function trim(arr?: DatedPoint[]) {
      if (!arr || cutoff == null) return arr;
      return arr.slice(-cutoff);
    }
    return {
      new: activeKeys.has("new") ? trim(series) : undefined,
      used: activeKeys.has("used") ? trim(usedSeries) : undefined,
      bricklink: activeKeys.has("bricklink") ? trim(sources?.bricklink) : undefined,
      brickowl: activeKeys.has("brickowl") ? trim(sources?.brickowl) : undefined,
      brickeconomy: activeKeys.has("brickeconomy")
        ? trim(sources?.brickeconomy)
        : undefined,
    } satisfies Partial<Record<PriceSeriesKey, DatedPoint[] | undefined>>;
  }, [range, activeKeys, series, usedSeries, sources]);

  const chartData = useMemo(() => stitch(filteredBy), [filteredBy]);

  const availableKeys: PriceSeriesKey[] = [
    "new",
    ...(usedSeries?.length ? (["used"] as const) : []),
    ...((sources?.bricklink ? ["bricklink"] : []) as PriceSeriesKey[]),
    ...((sources?.brickowl ? ["brickowl"] : []) as PriceSeriesKey[]),
    ...((sources?.brickeconomy ? ["brickeconomy"] : []) as PriceSeriesKey[]),
  ];

  function toggle(key: PriceSeriesKey) {
    setActiveKeys((curr) => {
      const next = new Set(curr);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const visibleEvents = useMemo(() => {
    if (!chartData.length) return [] as PriceChartEvent[];
    const first = chartData[0].date;
    const last = chartData[chartData.length - 1].date;
    return events.filter((e) => e.date >= first && e.date <= last);
  }, [events, chartData]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full border border-border-thin bg-bg-raised p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-mono font-tabular uppercase tracking-[0.08em] transition",
                range === r
                  ? "bg-accent text-accent-foreground"
                  : "text-text-tertiary hover:text-text-primary",
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {availableKeys.map((k) => {
            const isOn = activeKeys.has(k);
            return (
              <button
                key={k}
                type="button"
                onClick={() => toggle(k)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] transition",
                  isOn
                    ? "border-border-emphasis bg-bg-overlay text-text-primary"
                    : "border-border-thin text-text-tertiary hover:text-text-secondary",
                )}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: SERIES_COLOR[k] }}
                />
                {SERIES_LABEL[k]}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 12, right: 18, left: 0, bottom: 0 }}
          >
            <defs>
              {availableKeys.map((k) => (
                <linearGradient
                  id={`${gradId}-${k}`}
                  key={k}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={SERIES_COLOR[k]} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={SERIES_COLOR[k]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="2 4"
              vertical={false}
              stroke="var(--border-thin)"
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatAxisDate}
              tick={{
                fill: "var(--text-tertiary)",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
              }}
              tickLine={false}
              axisLine={false}
              minTickGap={28}
            />
            <YAxis
              tickFormatter={formatPrice}
              tick={{
                fill: "var(--text-tertiary)",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
              }}
              tickLine={false}
              axisLine={false}
              width={52}
              domain={["auto", "auto"]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--text-quaternary)",
                strokeDasharray: "2 4",
              }}
            />
            {availableKeys.map((k) =>
              activeKeys.has(k) ? (
                <Area
                  key={k}
                  type="monotone"
                  dataKey={k}
                  name={SERIES_LABEL[k]}
                  stroke={SERIES_COLOR[k]}
                  strokeWidth={1.75}
                  fill={`url(#${gradId}-${k})`}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  connectNulls
                />
              ) : null,
            )}
            {visibleEvents.map((e) => (
              <ReferenceLine
                key={`rl-${e.date}-${e.label}`}
                x={e.date}
                stroke="var(--warning)"
                strokeDasharray="2 3"
                strokeOpacity={0.55}
              />
            ))}
            {visibleEvents.map((e) => {
              const row = chartData.find((r) => r.date === e.date);
              const yVal = row?.new ?? row?.used;
              if (yVal === undefined) return null;
              return (
                <ReferenceDot
                  key={`rd-${e.date}-${e.label}`}
                  x={e.date}
                  y={yVal}
                  r={3}
                  fill="var(--warning)"
                  stroke="var(--bg-base)"
                  strokeWidth={1.5}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {visibleEvents.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border-thin pt-3">
          {visibleEvents.map((e) => (
            <span
              key={`${e.date}-${e.label}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--warning)_14%,transparent)] px-2 py-0.5 text-[11px] text-warning"
            >
              <span className="size-1 rounded-full bg-warning" />
              <span className="font-mono font-tabular">{formatAxisDate(e.date)}</span>
              <span>· {e.label}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
