"use client";

import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { themeColor, type ThemeAllocation } from "@/lib/mock/portfolio";

interface AllocationDonutProps {
  allocations: ThemeAllocation[];
  total: number;
  className?: string;
}

export function AllocationDonut({
  allocations,
  total,
  className,
}: AllocationDonutProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex != null ? allocations[activeIndex] : null;
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        "flex flex-col rounded-2xl border border-border-thin bg-bg-raised p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            Allocation by theme
          </div>
          <div className="mt-1 font-serif-display text-[22px] leading-tight text-text-primary">
            Where the value lives.
          </div>
        </div>
        <div className="text-micro font-mono font-tabular text-text-quaternary">
          {allocations.length} themes
        </div>
      </div>

      <div className="mt-4 grid flex-1 gap-5 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
        <div className="relative mx-auto aspect-square w-full max-w-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocations}
                dataKey="value"
                nameKey="slug"
                innerRadius="62%"
                outerRadius="92%"
                paddingAngle={1.5}
                stroke="var(--bg-raised)"
                strokeWidth={2}
                startAngle={90}
                endAngle={-270}
                isAnimationActive={!reduceMotion}
                animationBegin={120}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {allocations.map((a, i) => (
                  <Cell
                    key={a.slug}
                    fill={themeColor(a.slug)}
                    opacity={activeIndex == null || activeIndex === i ? 1 : 0.4}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                    style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-micro font-mono font-tabular text-text-tertiary">
              {active ? active.name : "Total"}
            </div>
            <div className="mt-1 font-mono font-tabular text-2xl tracking-tight tabular-nums text-text-primary">
              ${Math.round(active ? active.value : total).toLocaleString()}
            </div>
            <div className="mt-0.5 text-micro font-mono font-tabular text-text-quaternary">
              {active
                ? `${((active.value / total) * 100).toFixed(1)}%`
                : "portfolio"}
            </div>
          </div>
        </div>

        <ul className="flex flex-col gap-1.5">
          {allocations.map((a, i) => {
            const pct = (a.value / total) * 100;
            return (
              <li
                key={a.slug}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors",
                  activeIndex === i && "bg-bg-overlay",
                )}
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: themeColor(a.slug) }}
                  aria-hidden
                />
                <span className="flex-1 truncate text-small text-text-secondary">
                  {a.name}
                </span>
                <span className="font-mono font-tabular text-small tabular-nums text-text-primary">
                  ${Math.round(a.value).toLocaleString()}
                </span>
                <span className="w-12 text-right font-mono font-tabular text-micro tabular-nums text-text-tertiary">
                  {pct.toFixed(1)}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
