"use client";

import { FadeIn, SlideUp } from "@/components/motion";
import { StatCardV2 } from "@/components/ui/stat-card-v2";
import { Sparkline } from "@/components/charts/sparkline";
import { DeltaChip } from "@/components/ui/delta-chip";
import { IndexBadge } from "@/components/ui/index-badge";
import { CountUp } from "@/components/motion/count-up";
import type { SeriesPoint } from "@/lib/mock/series";

interface PortfolioMockupProps {
  portfolioSeries: SeriesPoint[];
  unrealizedSeries: SeriesPoint[];
  holdings: Array<{
    id: string;
    name: string;
    series: number[];
    value: number;
    delta: number;
  }>;
}

/**
 * Animated portfolio mockup — the "aha" frame for the sub-hero.
 * Composes StatCardV2 + sparkline + synthetic holdings rows. Mock data only.
 */
export function PortfolioMockup({
  portfolioSeries,
  unrealizedSeries,
  holdings,
}: PortfolioMockupProps) {
  return (
    <FadeIn delay={0.3}>
      <div className="glow-accent relative overflow-hidden rounded-2xl border border-border-emphasis bg-card">
        <div className="flex items-center justify-between border-b border-border-thin px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-micro font-mono font-tabular text-text-tertiary">
              Portfolio · mock data
            </span>
          </div>
          <IndexBadge name="BrickX 100" tone="brand" size="sm" figure="+2.3%" />
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-border-thin bg-bg-raised p-5">
            <div className="text-micro font-mono font-tabular text-text-tertiary">
              Total value
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono font-tabular text-2xl text-text-tertiary">
                $
              </span>
              <CountUp
                value={12480}
                decimals={0}
                className="font-mono font-tabular text-5xl text-text-primary tabular-nums tracking-tight"
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <DeltaChip value={11.11} size="sm" />
              <span className="text-micro text-text-tertiary">past 90 days</span>
            </div>
            <div className="mt-4">
              <Sparkline
                data={portfolioSeries}
                width={480}
                height={64}
                strokeWidth={1.5}
                tone="accent"
                className="w-full"
              />
            </div>
          </div>

          <StatCardV2
            label="Unrealized gain"
            value={2140}
            prefix="$"
            series={unrealizedSeries}
            delta={18.5}
            deltaLabel="all-time"
            density="compact"
          />
        </div>

        <div className="divide-y divide-border-thin">
          {holdings.map((h, i) => (
            <SlideUp key={h.id} delay={0.4 + i * 0.05}>
              <div className="flex items-center gap-4 px-5 py-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-bg-overlay text-micro font-mono font-tabular text-text-tertiary">
                  {h.id}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-small text-text-primary">
                    {h.name}
                  </div>
                </div>
                <Sparkline data={h.series} width={80} height={22} />
                <div className="w-20 text-right font-mono font-tabular text-small text-text-primary tabular-nums">
                  ${h.value.toFixed(0)}
                </div>
                <div className="w-[72px] text-right">
                  <DeltaChip value={h.delta} size="sm" hideIcon />
                </div>
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}
