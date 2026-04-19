"use client";

import { CountUp } from "@/components/motion";
import { DeltaChip } from "@/components/ui/delta-chip";
import { cn } from "@/lib/utils/cn";
import type { SetStatus } from "@/lib/types/database";

const STATUS_PILL: Record<SetStatus, { label: string; cls: string }> = {
  available: {
    label: "Available",
    cls: "bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-success",
  },
  retired: {
    label: "Retired",
    cls: "bg-[color-mix(in_oklab,var(--danger)_14%,transparent)] text-danger",
  },
  unreleased: {
    label: "Unreleased",
    cls: "bg-bg-overlay text-text-tertiary",
  },
};

interface SetInfoHeaderProps {
  setId: string;
  name: string;
  theme: string;
  year: number;
  status: SetStatus;
  marketValue: number;
  msrp: number;
  delta30d: number;
  delta1y: number | null;
}

export function SetInfoHeader({
  setId,
  name,
  theme,
  year,
  status,
  marketValue,
  msrp,
  delta30d,
  delta1y,
}: SetInfoHeaderProps) {
  const pill = STATUS_PILL[status];
  const vsMsrp = msrp > 0 ? ((marketValue - msrp) / msrp) * 100 : null;

  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono font-tabular uppercase tracking-[0.08em]",
              pill.cls,
            )}
          >
            {pill.label}
          </span>
          <span className="text-micro font-mono font-tabular text-text-tertiary">
            #{setId} · {theme} · {year}
          </span>
        </div>
        <h1 className="text-4xl font-medium tracking-tight text-text-primary lg:text-h2">
          {name}
        </h1>
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
          {delta1y != null && (
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
          )}
          {msrp > 0 && (
            <span className="font-mono font-tabular tabular-nums">
              MSRP{" "}
              <span className="ml-1 text-text-secondary">
                ${msrp.toFixed(0)}
              </span>
            </span>
          )}
          {vsMsrp != null && (
            <span className="font-mono font-tabular tabular-nums">
              vs MSRP{" "}
              <span
                className={cn(
                  "ml-1",
                  vsMsrp >= 0 ? "text-success" : "text-danger",
                )}
              >
                {vsMsrp >= 0 ? "+" : ""}
                {vsMsrp.toFixed(1)}%
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
