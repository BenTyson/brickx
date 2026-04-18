"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { DeltaChip } from "@/components/ui/delta-chip";
import { Sparkline } from "@/components/charts/sparkline";
import type { MoverEntry } from "@/lib/mock/indices";

interface MoversStripProps {
  gainers: MoverEntry[];
  losers: MoverEntry[];
  className?: string;
}

export function MoversStrip({ gainers, losers, className }: MoversStripProps) {
  const all = [...gainers.slice(0, 4), ...losers.slice(0, 4)];

  return (
    <section className={cn("rounded-2xl border border-border-thin bg-bg-raised p-5 sm:p-6", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            Today&rsquo;s biggest moves
          </div>
          <div className="mt-1 font-serif-display text-[22px] leading-tight text-text-primary">
            Who moved the market today.
          </div>
        </div>
        <div className="flex items-center gap-3 text-micro font-mono font-tabular">
          <span className="text-success">{gainers.length} up</span>
          <span className="text-text-quaternary">·</span>
          <span className="text-danger">{losers.length} down</span>
        </div>
      </div>

      <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border-thin sm:grid-cols-2 lg:grid-cols-4">
        {all.map((entry) => {
          const isGain = entry.delta1d >= 0;
          return (
            <Link
              key={entry.set.id}
              href={`/demo/sets/${entry.set.id}`}
              className="group flex flex-col gap-2 bg-bg-raised p-4 transition hover:bg-bg-overlay"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-small font-medium text-text-primary transition group-hover:text-accent-hover">
                    {entry.set.name}
                  </div>
                  <div className="mt-0.5 text-micro font-mono font-tabular text-text-tertiary">
                    #{entry.set.id} · {entry.set.theme}
                  </div>
                </div>
                <DeltaChip value={entry.delta1d} size="sm" />
              </div>

              <div className="flex items-end justify-between gap-2">
                <div>
                  <div className="font-mono font-tabular text-[18px] tabular-nums text-text-primary">
                    ${entry.set.currentValue.toLocaleString()}
                  </div>
                  <div className="text-micro font-mono font-tabular text-text-tertiary">
                    vol {entry.volume}
                  </div>
                </div>
                <Sparkline
                  data={entry.sparkline}
                  width={64}
                  height={28}
                  tone={isGain ? "success" : "danger"}
                  showEndDot={false}
                  ariaLabel={`${entry.set.name} daily sparkline`}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
