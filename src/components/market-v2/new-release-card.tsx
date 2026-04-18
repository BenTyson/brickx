import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { DeltaChip } from "@/components/ui/delta-chip";
import { Sparkline } from "@/components/charts/sparkline";
import type { NewReleaseEntry } from "@/lib/mock/indices";

interface NewReleaseCardProps {
  entry: NewReleaseEntry;
  className?: string;
}

export function NewReleaseCard({ entry, className }: NewReleaseCardProps) {
  const { set, daysOnMarket, priceVsMsrp, first30d } = entry;
  const isAboveMsrp = priceVsMsrp >= 0;

  return (
    <Link
      href={`/demo/sets/${set.id}`}
      className={cn(
        "group flex flex-col gap-3 rounded-2xl border border-border-thin bg-bg-raised p-5 transition hover:border-border-emphasis hover:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
        className,
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <span className="rounded border border-accent/30 bg-accent/10 px-2 py-0.5 text-micro font-mono font-tabular uppercase tracking-[0.08em] text-accent">
          New · {daysOnMarket}d
        </span>
        <DeltaChip value={priceVsMsrp} size="sm" suffix="vs MSRP" />
      </div>

      {/* Set info */}
      <div>
        <div className="font-medium text-text-primary transition group-hover:text-accent-hover">
          {set.name}
        </div>
        <div className="mt-0.5 text-micro font-mono font-tabular text-text-tertiary">
          #{set.id} · {set.theme} · {set.year}
        </div>
      </div>

      {/* Sparkline — "first 30 days" chart */}
      <div className="rounded-lg border border-border-thin bg-bg-overlay px-3 py-2">
        <div className="mb-1.5 text-micro font-mono font-tabular text-text-tertiary">
          First {Math.min(daysOnMarket, 30)} days
        </div>
        <Sparkline
          data={first30d}
          width={200}
          height={40}
          tone={isAboveMsrp ? "success" : "danger"}
          showEndDot
          className="w-full"
          ariaLabel={`${set.name} first 30-day price`}
        />
      </div>

      {/* Price row */}
      <div className="flex items-baseline justify-between">
        <div>
          <div className="font-mono font-tabular text-[22px] tabular-nums text-text-primary">
            ${set.currentValue.toLocaleString()}
          </div>
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            MSRP ${set.msrp.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-micro font-mono font-tabular text-text-tertiary">{set.parts.toLocaleString()} parts</div>
          {set.minifigs > 0 && (
            <div className="text-micro font-mono font-tabular text-text-tertiary">{set.minifigs} figs</div>
          )}
        </div>
      </div>
    </Link>
  );
}
