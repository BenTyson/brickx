"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Package } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { Sparkline } from "@/components/charts/sparkline";
import { DeltaChip } from "@/components/ui/delta-chip";
import type { SeriesPoint } from "@/lib/mock/series";
import type { SetStatus } from "@/lib/types/database";

const statusPill: Record<SetStatus, { label: string; className: string }> = {
  available: {
    label: "Available",
    className:
      "bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-success",
  },
  retired: {
    label: "Retired",
    className:
      "bg-[color-mix(in_oklab,var(--danger)_14%,transparent)] text-danger",
  },
  unreleased: {
    label: "Unreleased",
    className: "bg-bg-overlay text-text-tertiary",
  },
};

interface SetCardV2Props {
  id: string;
  name: string;
  theme: string;
  year?: number;
  status: SetStatus;
  imgUrl?: string | null;
  msrp?: number | null;
  currentValue?: number | null;
  pctChange?: number | null;
  sparkline?: SeriesPoint[] | number[];
  href?: string;
  className?: string;
}

/**
 * SetCard v2 — premium hover (scale + elevation + border glow),
 * sparkline strip beneath image, status pill, MSRP → current with
 * animated directional arrow.
 */
export function SetCardV2({
  id,
  name,
  theme,
  year,
  status,
  imgUrl,
  msrp,
  currentValue,
  pctChange,
  sparkline,
  href,
  className,
}: SetCardV2Props) {
  const delta = pctChange ?? 0;
  const direction = delta >= 0 ? "up" : "down";
  const badge = statusPill[status];

  const Content = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border-thin bg-card",
        "transition-shadow duration-300 hover:border-border-emphasis",
        "hover:shadow-[0_0_0_1px_var(--border-emphasis),0_24px_60px_-28px_color-mix(in_oklab,var(--accent)_55%,transparent)]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-overlay">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="text-text-quaternary size-10" />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono font-tabular uppercase tracking-[0.08em]",
              badge.className,
            )}
          >
            {badge.label}
          </span>
        </div>

        <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ArrowUpRight className="size-3.5" strokeWidth={2.4} />
          </span>
        </div>

        {sparkline && sparkline.length > 1 && (
          <div className="absolute inset-x-0 bottom-0 h-10">
            <Sparkline
              data={sparkline}
              width={400}
              height={40}
              strokeWidth={1.25}
              className="h-10 w-full"
              showEndDot={false}
              ariaLabel={`${name} price trend`}
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            {id}
            {year ? ` · ${year}` : ""}
          </div>
          <h3 className="mt-1 line-clamp-1 text-base font-medium text-text-primary">
            {name}
          </h3>
          <div className="text-small text-text-secondary">{theme}</div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="flex items-center gap-1.5 text-text-tertiary">
            <span className="text-micro font-mono font-tabular">
              MSRP {msrp != null ? `$${msrp.toFixed(0)}` : "—"}
            </span>
            <motion.span
              initial={false}
              animate={{ x: direction === "up" ? 0 : 0, rotate: 0 }}
              className={cn(
                "text-sm",
                direction === "up" ? "text-success" : "text-danger",
              )}
            >
              →
            </motion.span>
            <span className="text-small font-mono font-tabular text-text-primary">
              {currentValue != null ? `$${currentValue.toFixed(0)}` : "—"}
            </span>
          </div>
          {pctChange != null && (
            <DeltaChip value={pctChange} size="sm" hideIcon />
          )}
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {Content}
      </Link>
    );
  }
  return Content;
}
