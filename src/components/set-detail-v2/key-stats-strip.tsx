import { cn } from "@/lib/utils/cn";
import type { SetDetailKeyStats } from "@/lib/mock/set-detail";

interface KeyStatsStripProps {
  stats: SetDetailKeyStats;
  className?: string;
}

interface Cell {
  label: string;
  value: string;
  hint?: string;
  tone?: "primary" | "success" | "danger" | "muted";
}

/**
 * StockX-style stats strip — last sale, 30d high/low, 30d volume, volatility.
 * Pure layout/typography, no JS.
 */
export function KeyStatsStrip({ stats, className }: KeyStatsStripProps) {
  const cells: Cell[] = [
    {
      label: "Last sale",
      value: `$${stats.lastSale.toFixed(2)}`,
      hint: "blended",
    },
    {
      label: "30d high",
      value: `$${stats.high30d.toFixed(0)}`,
      tone: "success",
    },
    {
      label: "30d low",
      value: `$${stats.low30d.toFixed(0)}`,
      tone: "danger",
    },
    {
      label: "30d volume",
      value: `${stats.volume30d}`,
      hint: "qty sold",
    },
    {
      label: "Volatility",
      value: `${stats.volatility.toFixed(1)}%`,
      hint: "annualized",
      tone: "muted",
    },
  ];
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border-thin bg-border-thin sm:grid-cols-3 lg:grid-cols-5",
        className,
      )}
    >
      {cells.map((c) => (
        <div
          key={c.label}
          className="flex flex-col gap-1 bg-card px-5 py-4"
        >
          <span className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
            {c.label}
          </span>
          <span
            className={cn(
              "font-mono font-tabular tabular-nums text-2xl",
              c.tone === "success"
                ? "text-success"
                : c.tone === "danger"
                  ? "text-danger"
                  : c.tone === "muted"
                    ? "text-text-secondary"
                    : "text-text-primary",
            )}
          >
            {c.value}
          </span>
          {c.hint && (
            <span className="text-[10px] font-mono font-tabular uppercase tracking-[0.06em] text-text-quaternary">
              {c.hint}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
