"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { DeltaChip } from "@/components/ui/delta-chip";
import { Sparkline } from "@/components/charts/sparkline";
import { indexSparkline, type MarketIndex } from "@/lib/mock/indices";

interface IndexCardProps {
  index: MarketIndex;
  className?: string;
}

const toneClasses: Record<MarketIndex["tone"], string> = {
  brand: "from-accent/8 to-transparent",
  warm: "from-warning/8 to-transparent",
  cool: "from-[#8B5CF6]/8 to-transparent",
  neutral: "from-text-quaternary/6 to-transparent",
};

const accentClasses: Record<MarketIndex["tone"], string> = {
  brand: "text-accent border-accent/30 bg-accent/10",
  warm: "text-warning border-warning/30 bg-warning/10",
  cool: "text-[#8B5CF6] border-[#8B5CF6]/30 bg-[#8B5CF6]/10",
  neutral: "text-text-secondary border-border-thin bg-bg-overlay",
};

export function IndexCard({ index, className }: IndexCardProps) {
  const sparkline = indexSparkline(index.slug);
  const isGain = index.delta30d >= 0;

  return (
    <Link
      href={`/demo/market/indices/${index.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border-thin bg-bg-raised p-5 transition",
        "hover:border-border-emphasis hover:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
          toneClasses[index.tone],
        )}
      />
      <div className="relative z-[1] flex h-full flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span
              className={cn(
                "rounded border px-2 py-0.5 text-micro font-mono font-tabular uppercase tracking-[0.08em]",
                accentClasses[index.tone],
              )}
            >
              {index.shortName}
            </span>
            <div className="mt-2 text-small font-medium text-text-primary leading-tight">
              {index.name}
            </div>
          </div>
          <DeltaChip value={index.delta30d} suffix="30d" size="sm" />
        </div>

        {/* Value */}
        <div className="mt-auto">
          <div className="font-mono font-tabular text-[28px] leading-none tabular-nums text-text-primary">
            {index.currentValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <DeltaChip value={index.delta1d} suffix="today" size="sm" hideIcon />
            <DeltaChip value={index.delta1y} suffix="1y" size="sm" hideIcon />
          </div>
        </div>

        {/* Sparkline */}
        <Sparkline
          data={sparkline}
          width={160}
          height={36}
          tone={isGain ? "success" : "danger"}
          strokeWidth={1.4}
          showEndDot={false}
          className="mt-1 w-full"
          ariaLabel={`${index.shortName} 30-day sparkline`}
        />

        <p className="text-micro text-text-tertiary line-clamp-2">{index.tagline}</p>
      </div>
    </Link>
  );
}
