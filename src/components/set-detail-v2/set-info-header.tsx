"use client";

import { CountUp } from "@/components/motion";
import { DeltaChip } from "@/components/ui/delta-chip";
import { IndexBadge } from "@/components/ui/index-badge";
import { BidAskPair } from "@/components/ui/bid-ask-pair";
import { cn } from "@/lib/utils/cn";
import type { CatalogSet } from "@/lib/mock/catalog";
import type {
  SetDetailIndexMembership,
} from "@/lib/mock/set-detail";

const STATUS_PILL: Record<
  CatalogSet["status"],
  { label: string; cls: string }
> = {
  available: {
    label: "Available",
    cls: "bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-success",
  },
  retired: {
    label: "Retired",
    cls: "bg-[color-mix(in_oklab,var(--danger)_14%,transparent)] text-danger",
  },
  "retiring-soon": {
    label: "Retiring soon",
    cls: "bg-[color-mix(in_oklab,var(--warning)_14%,transparent)] text-warning",
  },
  exclusive: {
    label: "Exclusive",
    cls: "bg-[color-mix(in_oklab,var(--info)_14%,transparent)] text-info",
  },
  unreleased: {
    label: "Unreleased",
    cls: "bg-bg-overlay text-text-tertiary",
  },
};

interface SetInfoHeaderProps {
  set: CatalogSet;
  marketValue: number;
  delta30d: number;
  delta1y: number;
  bid: number;
  ask: number;
  indices: SetDetailIndexMembership[];
}

export function SetInfoHeader({
  set,
  marketValue,
  delta30d,
  delta1y,
  bid,
  ask,
  indices,
}: SetInfoHeaderProps) {
  const status = STATUS_PILL[set.status];
  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono font-tabular uppercase tracking-[0.08em]",
              status.cls,
            )}
          >
            {status.label}
          </span>
          <span className="text-micro font-mono font-tabular text-text-tertiary">
            #{set.id} · {set.theme} · {set.year}
          </span>
        </div>
        <h1 className="text-4xl font-medium tracking-tight text-text-primary lg:text-h2">
          {set.name}
        </h1>
        {indices.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-micro font-mono font-tabular text-text-quaternary">
              Member of
            </span>
            {indices.map((idx) => (
              <IndexBadge
                key={idx.slug}
                name={idx.name}
                tone={idx.tone}
                slug={idx.slug}
                size="sm"
                figure={
                  idx.weight ? `${(idx.weight * 100).toFixed(1)}%` : undefined
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3 border-t border-border-thin pt-6">
        <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
          Blended market value · new condition
        </div>
        <div className="flex items-baseline gap-4">
          <span className="font-serif-display text-5xl text-text-primary lg:text-6xl">
            <CountUp value={marketValue} prefix="$" decimals={0} duration={1.6} />
          </span>
          <DeltaChip value={delta30d} suffix="30d" />
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-small text-text-tertiary">
          <span className="font-mono font-tabular tabular-nums">
            1Y{" "}
            <span
              className={cn(
                "ml-1",
                delta1y >= 0 ? "text-success" : "text-danger",
              )}
            >
              {delta1y >= 0 ? "+" : ""}
              {delta1y.toFixed(2)}%
            </span>
          </span>
          <span className="font-mono font-tabular tabular-nums">
            MSRP{" "}
            <span className="ml-1 text-text-secondary">
              ${set.msrp.toFixed(0)}
            </span>
          </span>
          <span className="font-mono font-tabular tabular-nums">
            vs MSRP{" "}
            <span
              className={cn(
                "ml-1",
                marketValue >= set.msrp ? "text-success" : "text-danger",
              )}
            >
              {marketValue >= set.msrp ? "+" : ""}
              {(((marketValue - set.msrp) / set.msrp) * 100).toFixed(1)}%
            </span>
          </span>
        </div>
      </div>

      <BidAskPair bid={bid} ask={ask} size="md" className="w-full" />
    </div>
  );
}
