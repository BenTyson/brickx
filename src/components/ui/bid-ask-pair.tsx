import { cn } from "@/lib/utils/cn";

interface BidAskPairProps {
  bid?: number | null;
  ask?: number | null;
  /** Currency symbol. Default "$". */
  currency?: string;
  /** Label above the bid figure. Default "Lowest ask" / "Highest bid" semantic. */
  bidLabel?: string;
  askLabel?: string;
  /** Size variant. */
  size?: "md" | "lg";
  className?: string;
}

/**
 * StockX-style bid/ask dual display.
 * Bid in green, ask in red, centered on hairline divider.
 * Used on set-detail pages.
 */
export function BidAskPair({
  bid,
  ask,
  currency = "$",
  bidLabel = "Highest bid",
  askLabel = "Lowest ask",
  size = "md",
  className,
}: BidAskPairProps) {
  const figureSize = size === "lg" ? "text-4xl" : "text-2xl";
  return (
    <div
      className={cn(
        "inline-grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-xl border border-border-thin bg-card px-5 py-4",
        className,
      )}
    >
      <div className="text-left">
        <div className="text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
          {bidLabel}
        </div>
        <div
          className={cn(
            "mt-1 font-mono font-tabular tabular-nums text-success",
            figureSize,
          )}
        >
          {bid != null ? (
            <>
              <span className="text-success/60">{currency}</span>
              {bid.toFixed(bid < 100 ? 2 : 0)}
            </>
          ) : (
            <span className="text-text-quaternary">—</span>
          )}
        </div>
      </div>

      <div className="h-12 w-px bg-border-emphasis" aria-hidden />

      <div className="text-right">
        <div className="text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
          {askLabel}
        </div>
        <div
          className={cn(
            "mt-1 font-mono font-tabular tabular-nums text-danger",
            figureSize,
          )}
        >
          {ask != null ? (
            <>
              <span className="text-danger/60">{currency}</span>
              {ask.toFixed(ask < 100 ? 2 : 0)}
            </>
          ) : (
            <span className="text-text-quaternary">—</span>
          )}
        </div>
      </div>
    </div>
  );
}
