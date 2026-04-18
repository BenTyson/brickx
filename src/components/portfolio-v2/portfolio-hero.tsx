"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils/cn";
import { CountUp } from "@/components/motion/count-up";
import { DeltaChip } from "@/components/ui/delta-chip";
import {
  portfolioHistory,
  type HistoryRangeKey,
  type PortfolioSnapshot,
} from "@/lib/mock/portfolio";

interface PortfolioHeroProps {
  snapshot: PortfolioSnapshot;
  /** Headline label above the value. */
  label?: string;
  /** Show cost-basis reference line on chart. */
  showCostBasis?: boolean;
  className?: string;
}

const RANGES: HistoryRangeKey[] = ["1W", "1M", "3M", "1Y", "ALL"];

const DELTA_RANGES: Array<{
  key: HistoryRangeKey;
  label: string;
  valueKey: keyof Pick<
    PortfolioSnapshot,
    "deltaToday" | "delta7d" | "delta30d" | "deltaAll"
  >;
}> = [
  { key: "1W", label: "today", valueKey: "deltaToday" },
  { key: "1W", label: "7d", valueKey: "delta7d" },
  { key: "1M", label: "30d", valueKey: "delta30d" },
  { key: "ALL", label: "all-time", valueKey: "deltaAll" },
];

function fmtShortDate(raw: string) {
  const d = new Date(raw);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

function fmtFullDate(raw: string) {
  const d = new Date(raw);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function fmtDollars(v: number) {
  if (v >= 100000) return `$${Math.round(v / 1000)}k`;
  return `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length || !label) return null;
  const v = payload[0].value;
  return (
    <div className="rounded-md border border-border-emphasis bg-popover px-3 py-2 shadow-xl">
      <div className="text-micro font-mono font-tabular text-text-tertiary">
        {fmtFullDate(label)}
      </div>
      <div className="mt-1 font-mono font-tabular text-small text-text-primary tabular-nums">
        ${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}
      </div>
    </div>
  );
}

export function PortfolioHero({
  snapshot,
  label = "Total portfolio value",
  showCostBasis = true,
  className,
}: PortfolioHeroProps) {
  const [range, setRange] = useState<HistoryRangeKey>("1Y");
  const { series, costBasisLine } = useMemo(
    () => portfolioHistory(range, snapshot),
    [range, snapshot],
  );

  const activeDelta = useMemo(() => {
    switch (range) {
      case "1W":
        return snapshot.delta7d;
      case "1M":
        return snapshot.delta30d;
      case "3M":
        return snapshot.delta30d * 2.4;
      case "1Y":
        return 22;
      case "ALL":
      default:
        return snapshot.deltaAll;
    }
  }, [range, snapshot]);

  const first = series[0]?.v ?? snapshot.costBasis;
  const last = series[series.length - 1]?.v ?? snapshot.totalValue;
  const isGain = last >= first;

  return (
    <section
      className={cn(
        "bg-noise relative overflow-hidden rounded-2xl border border-border-thin bg-bg-raised p-6 sm:p-8",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 80% 0%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 70%)",
        }}
      />
      <div className="relative z-[2] grid gap-6 lg:grid-cols-[minmax(0,auto)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            {label}
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-mono font-tabular text-text-tertiary text-3xl sm:text-4xl">
              $
            </span>
            <CountUp
              value={snapshot.totalValue}
              decimals={0}
              className="font-mono font-tabular tracking-tight tabular-nums text-text-primary text-[52px] leading-none sm:text-[72px]"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {DELTA_RANGES.map((r) => (
              <DeltaChip
                key={r.label}
                value={snapshot[r.valueKey]}
                suffix={r.label}
                size="sm"
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-border-thin pt-5 text-small">
            <HeroStat label="Cost basis" value={`$${Math.round(snapshot.costBasis).toLocaleString()}`} />
            <HeroStat
              label="Total gain"
              value={`${snapshot.gain >= 0 ? "+" : "−"}$${Math.abs(Math.round(snapshot.gain)).toLocaleString()}`}
              tone={snapshot.gain >= 0 ? "success" : "danger"}
            />
            <HeroStat label="Sets" value={snapshot.setCount.toString()} />
            <HeroStat label="Items" value={snapshot.itemCount.toString()} />
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <DeltaChip value={activeDelta} suffix={range === "ALL" ? "all" : range} size="sm" />
              <span className="text-micro font-mono font-tabular text-text-tertiary">
                {fmtShortDate(series[0]?.date ?? "")} → {fmtShortDate(series[series.length - 1]?.date ?? "")}
              </span>
            </div>
            <div className="flex items-center gap-0.5 rounded-full border border-border-thin bg-bg-overlay p-1">
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
          </div>

          <div className="mt-4 h-[220px] sm:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="portfolio-hero-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={isGain ? "var(--success)" : "var(--danger)"}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor={isGain ? "var(--success)" : "var(--danger)"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="2 4"
                  vertical={false}
                  stroke="var(--border-thin)"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={fmtShortDate}
                  tick={{
                    fill: "var(--text-tertiary)",
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                  }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={40}
                />
                <YAxis
                  tickFormatter={fmtDollars}
                  tick={{
                    fill: "var(--text-tertiary)",
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                  }}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: "var(--text-quaternary)", strokeDasharray: "2 4" }}
                />
                {showCostBasis && range === "ALL" && (
                  <ReferenceLine
                    y={costBasisLine}
                    stroke="var(--text-quaternary)"
                    strokeDasharray="3 4"
                    label={{
                      value: "cost",
                      position: "insideTopRight",
                      fill: "var(--text-quaternary)",
                      fontSize: 10,
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={isGain ? "var(--success)" : "var(--danger)"}
                  strokeWidth={1.75}
                  fill="url(#portfolio-hero-grad)"
                  activeDot={{ r: 3.5, strokeWidth: 0 }}
                  isAnimationActive
                  animationDuration={900}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success" | "danger";
}) {
  return (
    <div className="min-w-[96px]">
      <div className="text-micro font-mono font-tabular text-text-tertiary">{label}</div>
      <div
        className={cn(
          "mt-1 font-mono font-tabular tabular-nums text-text-primary",
          tone === "success" && "text-success",
          tone === "danger" && "text-danger",
        )}
      >
        {value}
      </div>
    </div>
  );
}
