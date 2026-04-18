"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Target, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { DeltaChip } from "@/components/ui/delta-chip";
import { StaggerChildren } from "@/components/motion";
import type { WishlistItem } from "@/lib/mock/portfolio";

interface WishlistGridProps {
  items: WishlistItem[];
  setHrefPrefix?: string;
  className?: string;
}

export function WishlistGrid({
  items,
  setHrefPrefix = "/demo/sets",
  className,
}: WishlistGridProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <StaggerChildren
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        stagger={0.04}
      >
        {items.map((w) => (
          <WishlistCard key={w.set.id} item={w} hrefPrefix={setHrefPrefix} />
        ))}
      </StaggerChildren>
    </section>
  );
}

function WishlistCard({ item, hrefPrefix }: { item: WishlistItem; hrefPrefix: string }) {
  const { set, targetPrice, dealDetected } = item;
  const progress = useMemo(() => {
    // Where does the current price sit between target and 30% above target?
    const lo = targetPrice;
    const hi = targetPrice * 1.3;
    const t = Math.min(Math.max((set.currentValue - lo) / Math.max(hi - lo, 1), 0), 1);
    return t;
  }, [set.currentValue, targetPrice]);

  const awayPct = ((set.currentValue - targetPrice) / targetPrice) * 100;

  return (
    <Link
      href={`${hrefPrefix}/${set.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border-thin bg-bg-raised p-4 transition",
        "hover:border-border-emphasis hover:-translate-y-[1px]",
      )}
    >
      {dealDetected && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--success)_20%,transparent)] px-2 py-0.5 text-[10px] font-mono font-tabular uppercase tracking-[0.08em] text-success">
          <Sparkles className="size-3" aria-hidden />
          Deal
        </div>
      )}
      <div className="flex items-center gap-3">
        <Thumb item={item} />
        <div className="min-w-0">
          <div className="truncate text-small text-text-primary">{set.name}</div>
          <div className="mt-0.5 text-micro font-mono font-tabular tabular-nums text-text-tertiary">
            #{set.id} · {set.theme}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div>
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            Current
          </div>
          <div className="mt-0.5 font-mono font-tabular text-h3 leading-none tabular-nums text-text-primary">
            ${set.currentValue.toFixed(0)}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-micro font-mono font-tabular text-text-tertiary">
            <Target className="size-3" aria-hidden /> target
          </div>
          <div className="mt-0.5 font-mono font-tabular text-small tabular-nums text-text-secondary">
            ${targetPrice.toFixed(0)}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="relative h-1 rounded-full bg-bg-overlay">
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full",
              dealDetected ? "bg-success" : "bg-accent",
            )}
            style={{ width: `${Math.max(progress * 100, 3)}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 size-2 rounded-full border border-border-emphasis bg-text-primary"
            style={{ left: `${Math.max(progress * 100, 0)}%`, transform: "translate(-50%, -50%)" }}
            aria-hidden
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 size-[6px] rounded-full bg-text-quaternary"
            style={{ left: "0%", transform: "translate(-50%, -50%)" }}
            aria-hidden
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-micro font-mono font-tabular tabular-nums text-text-tertiary">
          <span>at target</span>
          <DeltaChip value={awayPct} size="sm" hideIcon suffix="from target" />
        </div>
      </div>
    </Link>
  );
}

function Thumb({ item }: { item: WishlistItem }) {
  const { set } = item;
  const initials = set.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded bg-bg-overlay text-[11px] font-mono font-tabular tracking-[0.08em] text-text-tertiary">
      {initials}
    </div>
  );
}
