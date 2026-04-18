"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { CountUp } from "@/components/motion/count-up";
import { DeltaChip } from "@/components/ui/delta-chip";
import { indexHistory, type MarketIndex } from "@/lib/mock/indices";

type RangeKey = "1M" | "3M" | "1Y" | "3Y" | "ALL";
const RANGES: RangeKey[] = ["1M", "3M", "1Y", "3Y", "ALL"];

function fmtShort(raw: string) {
  const d = new Date(raw);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}
function fmtFull(raw: string) {
  const d = new Date(raw);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}
function fmtVal(v: number) {
  return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
  return (
    <div className="rounded-md border border-border-emphasis bg-popover px-3 py-2 shadow-xl">
      <div className="text-micro font-mono font-tabular text-text-tertiary">{fmtFull(label)}</div>
      <div className="mt-1 font-mono font-tabular text-small tabular-nums text-text-primary">
        {fmtVal(payload[0].value)}
      </div>
    </div>
  );
}

interface IndexHeroProps {
  index: MarketIndex;
  className?: string;
}

export function IndexHero({ index, className }: IndexHeroProps) {
  const [range, setRange] = useState<RangeKey>("1Y");
  const reduceMotion = useReducedMotion();
  const series = useMemo(() => indexHistory(index.slug, range), [index.slug, range]);

  const first = series[0]?.v ?? 100;
  const last = series[series.length - 1]?.v ?? index.currentValue;
  const isGain = last >= first;

  const activeRange = range === "1M" ? index.delta30d : range === "3M" ? index.delta30d * 2.4 : range === "1Y" ? index.delta1y : index.delta1y * 2.1;

  return (
    <section
      className={cn(
        "bg-noise relative overflow-hidden rounded-2xl border border-border-thin bg-bg-raised p-6 sm:p-8",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 75% 0%, color-mix(in oklab, var(--accent) 15%, transparent), transparent 70%)",
        }}
      />
      <div className="relative z-[2] grid gap-6 lg:grid-cols-[minmax(0,auto)_minmax(0,1fr)]">
        {/* Left: value + meta */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded border border-accent/30 bg-accent/10 px-2 py-0.5 text-micro font-mono font-tabular uppercase tracking-[0.08em] text-accent">
              {index.shortName}
            </span>
            <span className="text-micro font-mono font-tabular text-text-tertiary">{index.name}</span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <CountUp
              value={index.currentValue}
              decimals={2}
              className="font-mono font-tabular tracking-tight tabular-nums text-text-primary text-[52px] leading-none sm:text-[68px]"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <DeltaChip value={index.delta1d} suffix="today" size="sm" />
            <DeltaChip value={index.delta7d} suffix="7d" size="sm" />
            <DeltaChip value={index.delta30d} suffix="30d" size="sm" />
            <DeltaChip value={index.delta1y} suffix="1y" size="sm" />
          </div>

          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t border-border-thin pt-4 text-small">
            <IndexStat label="All-time high" value={fmtVal(index.allTimeHigh)} />
            <IndexStat label="Launch year" value={String(index.launchYear)} />
            <IndexStat label="Constituents" value={String(index.constituentIds.length)} />
          </div>

          <p className="mt-4 max-w-[28rem] text-small text-text-secondary leading-relaxed">
            {index.tagline}
          </p>
        </div>

        {/* Right: chart */}
        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <DeltaChip value={activeRange} suffix={range} size="sm" />
              <span className="text-micro font-mono font-tabular text-text-tertiary">
                {fmtShort(series[0]?.date ?? "")} → {fmtShort(series[series.length - 1]?.date ?? "")}
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
                  <linearGradient id={`ix-grad-${index.slug}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isGain ? "var(--success)" : "var(--danger)"} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={isGain ? "var(--success)" : "var(--danger)"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--border-thin)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={fmtShort}
                  tick={{ fill: "var(--text-tertiary)", fontSize: 10, fontFamily: "var(--font-mono)" }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={40}
                />
                <YAxis
                  tickFormatter={(v) => v.toFixed(1)}
                  tick={{ fill: "var(--text-tertiary)", fontSize: 10, fontFamily: "var(--font-mono)" }}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: "var(--text-quaternary)", strokeDasharray: "2 4" }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={isGain ? "var(--success)" : "var(--danger)"}
                  strokeWidth={1.75}
                  fill={`url(#ix-grad-${index.slug})`}
                  activeDot={{ r: 3.5, strokeWidth: 0 }}
                  isAnimationActive={!reduceMotion}
                  animationBegin={120}
                  animationDuration={1100}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

function IndexStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[80px]">
      <div className="text-micro font-mono font-tabular text-text-tertiary">{label}</div>
      <div className="mt-1 font-mono font-tabular tabular-nums text-text-primary">{value}</div>
    </div>
  );
}
