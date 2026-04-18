"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { themeHeatmap, type TrendPeriod } from "@/lib/mock/indices";

const PERIODS: Array<{ key: TrendPeriod; label: string }> = [
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
];

function cellColor(value: number): string {
  if (value >= 3) return "bg-[color-mix(in_oklab,var(--success)_55%,transparent)] text-success";
  if (value >= 1) return "bg-[color-mix(in_oklab,var(--success)_28%,transparent)] text-success";
  if (value >= -1) return "bg-bg-overlay text-text-secondary";
  if (value >= -3) return "bg-[color-mix(in_oklab,var(--danger)_28%,transparent)] text-danger";
  return "bg-[color-mix(in_oklab,var(--danger)_55%,transparent)] text-danger";
}

interface ThemeHeatmapProps {
  className?: string;
}

export function ThemeHeatmap({ className }: ThemeHeatmapProps) {
  const [period, setPeriod] = useState<TrendPeriod>("30d");
  const cells = themeHeatmap();
  const filtered = cells.filter((c) => c.period === period);
  const themes = [...new Set(cells.map((c) => c.theme))];

  return (
    <section className={cn("rounded-2xl border border-border-thin bg-bg-raised p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="text-micro font-mono font-tabular text-text-tertiary">Theme of the month</div>
          <div className="mt-1 font-serif-display text-[22px] leading-tight text-text-primary">
            Heat by theme.
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

      <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: "1fr" }}>
        {themes.map((theme) => {
          const cell = filtered.find((c) => c.theme === theme);
          if (!cell) return null;
          const abs = Math.abs(cell.value);
          const colorClass = cellColor(cell.value);
          const sign = cell.value >= 0 ? "+" : "";
          return (
            <div key={theme} className="flex items-center gap-3">
              <div className="w-36 shrink-0 text-small text-text-secondary">{theme}</div>
              {/* Bar */}
              <div className="relative flex h-8 flex-1 items-center overflow-hidden rounded-lg bg-bg-overlay">
                <div
                  className={cn(
                    "absolute left-0 h-full rounded-lg transition-all duration-500",
                    abs >= 3
                      ? cell.value >= 0
                        ? "bg-[color-mix(in_oklab,var(--success)_30%,transparent)]"
                        : "bg-[color-mix(in_oklab,var(--danger)_30%,transparent)]"
                      : abs >= 1
                        ? cell.value >= 0
                          ? "bg-[color-mix(in_oklab,var(--success)_16%,transparent)]"
                          : "bg-[color-mix(in_oklab,var(--danger)_16%,transparent)]"
                        : "bg-transparent",
                  )}
                  style={{ width: `${Math.min((abs / 5) * 100, 100)}%` }}
                  aria-hidden
                />
                <span className={cn("relative pl-3 font-mono font-tabular text-small tabular-nums", colorClass.split(" ").find(c => c.startsWith("text-")) ?? "text-text-primary")}>
                  {sign}{cell.value.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border-thin pt-3">
        {[
          { label: "Strong gain (>3%)", color: "bg-[color-mix(in_oklab,var(--success)_55%,transparent)]" },
          { label: "Gain", color: "bg-[color-mix(in_oklab,var(--success)_28%,transparent)]" },
          { label: "Flat", color: "bg-bg-overlay" },
          { label: "Loss", color: "bg-[color-mix(in_oklab,var(--danger)_28%,transparent)]" },
          { label: "Strong loss (<-3%)", color: "bg-[color-mix(in_oklab,var(--danger)_55%,transparent)]" },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className={cn("inline-block h-2.5 w-4 rounded-sm", l.color)} aria-hidden />
            <span className="text-micro font-mono font-tabular text-text-quaternary">{l.label}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
