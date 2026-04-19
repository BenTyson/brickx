import { cn } from "@/lib/utils/cn";

export interface SetDetailKeyStats {
  lastSale: number | null;
  high30d: number | null;
  low30d: number | null;
  investmentScore: number | null;
  pctChange90d: number | null;
}

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
 * StockX-style stats strip — last sale, 30d high/low, investment score,
 * 90d change. Values marked nullable so DB gaps degrade cleanly.
 */
export function KeyStatsStrip({ stats, className }: KeyStatsStripProps) {
  const fmtPrice = (v: number | null) =>
    v == null ? "—" : `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const fmtPct = (v: number | null) =>
    v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
  const fmtScore = (v: number | null) =>
    v == null ? "—" : v.toFixed(1);

  const cells: Cell[] = [
    {
      label: "Last sale",
      value: fmtPrice(stats.lastSale),
      hint: "blended",
    },
    {
      label: "30d high",
      value: fmtPrice(stats.high30d),
      tone: "success",
    },
    {
      label: "30d low",
      value: fmtPrice(stats.low30d),
      tone: "danger",
    },
    {
      label: "90d change",
      value: fmtPct(stats.pctChange90d),
      tone:
        stats.pctChange90d == null
          ? "muted"
          : stats.pctChange90d >= 0
            ? "success"
            : "danger",
    },
    {
      label: "Invest score",
      value: fmtScore(stats.investmentScore),
      hint: "0–100",
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
        <div key={c.label} className="flex flex-col gap-1 bg-card px-5 py-4">
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
