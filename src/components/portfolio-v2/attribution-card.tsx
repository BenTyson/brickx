"use client";

import { cn } from "@/lib/utils/cn";
import { themeColor, type ThemeAllocation } from "@/lib/mock/portfolio";

interface AttributionCardProps {
  allocations: ThemeAllocation[];
  periodLabel?: string;
  className?: string;
}

export function AttributionCard({
  allocations,
  periodLabel = "past 30 days",
  className,
}: AttributionCardProps) {
  const sorted = [...allocations].sort(
    (a, b) => Math.abs(b.monthContribution) - Math.abs(a.monthContribution),
  );
  const net = sorted.reduce((a, b) => a + b.monthContribution, 0);
  const max = Math.max(
    ...sorted.map((s) => Math.abs(s.monthContribution)),
    1,
  );
  const lead = sorted[0];

  return (
    <section
      className={cn(
        "rounded-2xl border border-border-thin bg-bg-raised p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            Performance attribution · {periodLabel}
          </div>
          <div className="mt-1 font-serif-display text-[22px] leading-tight text-text-primary">
            {lead && lead.monthContribution > 0
              ? `${lead.name} drove ${dollarsSigned(lead.monthContribution)} this month.`
              : lead
                ? `${lead.name} weighed ${dollarsSigned(lead.monthContribution)} on the month.`
                : "No movement yet."}
          </div>
        </div>
        <div
          className={cn(
            "font-mono font-tabular text-small tabular-nums",
            net >= 0 ? "text-success" : "text-danger",
          )}
        >
          net {dollarsSigned(net)}
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-2">
        {sorted.map((a) => {
          const frac = Math.abs(a.monthContribution) / max;
          const gain = a.monthContribution >= 0;
          return (
            <li key={a.slug} className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)_minmax(0,80px)] items-center gap-3">
              <span className="flex items-center gap-2 truncate text-small text-text-secondary">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: themeColor(a.slug) }}
                  aria-hidden
                />
                <span className="truncate">{a.name}</span>
              </span>
              <div className="relative grid grid-cols-[1fr_1px_1fr] items-center">
                <div className="flex h-1.5 justify-end">
                  {!gain && (
                    <div
                      className="h-full rounded-l-sm bg-danger/70"
                      style={{ width: `${frac * 100}%` }}
                    />
                  )}
                </div>
                <div className="h-4 w-px bg-border-emphasis" />
                <div className="flex h-1.5">
                  {gain && (
                    <div
                      className="h-full rounded-r-sm bg-success/80"
                      style={{ width: `${frac * 100}%` }}
                    />
                  )}
                </div>
              </div>
              <span
                className={cn(
                  "text-right font-mono font-tabular text-small tabular-nums",
                  gain ? "text-success" : "text-danger",
                )}
              >
                {dollarsSigned(a.monthContribution)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function dollarsSigned(v: number) {
  const abs = Math.abs(Math.round(v));
  return `${v >= 0 ? "+" : "−"}$${abs.toLocaleString()}`;
}
