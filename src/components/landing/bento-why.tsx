"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Database,
  Layers,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { ScrollReveal } from "@/components/motion";
import { Sparkline } from "@/components/charts/sparkline";
import { IndexBadge } from "@/components/ui/index-badge";
import type { SeriesPoint } from "@/lib/mock/series";

interface BentoWhyProps {
  indexSeries: SeriesPoint[];
  activityFeed: Array<{ id: string; text: string; delta?: number }>;
}

/**
 * Bento grid explaining the product. 2 large + 3 small cells.
 * One cell is a live-activity ticker (cycles through feed items).
 */
export function BentoWhy({ indexSeries, activityFeed }: BentoWhyProps) {
  return (
    <section id="why" className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 lg:px-14">
      <ScrollReveal>
        <div className="text-micro font-mono font-tabular text-text-tertiary">
          01 · Why BrickX
        </div>
        <h2 className="mt-4 max-w-[720px] text-h2 font-serif-display italic text-text-primary">
          A price engine, a portfolio, and a market — built for collectors who
          treat LEGO like a book of business.
        </h2>
      </ScrollReveal>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-[auto_auto]">
        <Cell className="md:col-span-4 md:row-span-1">
          <CellHeader icon={<BarChart3 className="size-4" />} eyebrow="Market engine" />
          <h3 className="mt-4 text-h3 font-serif-display italic text-text-primary">
            Three sources, one price.
          </h3>
          <p className="mt-3 max-w-[520px] text-body text-text-secondary">
            We blend BrickLink, BrickOwl, and BrickEconomy with a weighted
            aggregation that down-ranks outliers and thin volume. One clean
            market value per set — updated nightly.
          </p>
          <div className="mt-6 flex items-center gap-6">
            <SourceDot label="BrickLink" weight="0.50" />
            <SourceDot label="BrickOwl" weight="0.30" />
            <SourceDot label="BrickEconomy" weight="0.20" />
          </div>
        </Cell>

        <Cell className="md:col-span-2 md:row-span-2 relative overflow-hidden">
          <CellHeader icon={<Activity className="size-4" />} eyebrow="Live · Activity" />
          <h3 className="mt-4 text-h3 font-serif-display italic text-text-primary">
            Something&rsquo;s always moving.
          </h3>
          <ActivityTicker items={activityFeed} />
        </Cell>

        <Cell className="md:col-span-2 md:row-span-1">
          <CellHeader icon={<Bell className="size-4" />} eyebrow="Alerts" />
          <h3 className="mt-4 text-h3 font-serif-display italic text-text-primary">
            Targets, not refreshes.
          </h3>
          <p className="mt-2 text-small text-text-secondary">
            Price drop, value exceeded, wishlist available. Email when it hits.
          </p>
        </Cell>

        <Cell className="md:col-span-2 md:row-span-1">
          <CellHeader icon={<Layers className="size-4" />} eyebrow="Named indices" />
          <h3 className="mt-4 text-h3 font-serif-display italic text-text-primary">
            The BrickX 100.
          </h3>
          <div className="mt-3 flex items-center gap-2">
            <IndexBadge name="BrickX 100" tone="brand" size="sm" />
            <IndexBadge name="Modulars" tone="cool" size="sm" />
          </div>
          <div className="mt-4">
            <Sparkline
              data={indexSeries}
              width={260}
              height={40}
              tone="accent"
              strokeWidth={1.5}
              className="w-full"
            />
          </div>
        </Cell>

        <Cell className="md:col-span-2 md:row-span-1">
          <CellHeader icon={<Zap className="size-4" />} eyebrow="Intelligence" />
          <h3 className="mt-4 text-h3 font-serif-display italic text-text-primary">
            Retiring soon.
          </h3>
          <p className="mt-2 text-small text-text-secondary">
            Countdown chips, risk scores, historical retirement deltas — so you
            see what&rsquo;s about to re-rate.
          </p>
        </Cell>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-6">
        <Cell className="md:col-span-6">
          <div className="flex items-center gap-3 text-micro font-mono font-tabular text-text-tertiary">
            <Database className="size-4" />
            <span>Data depth</span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            <Stat big="26,095" small="sets indexed" />
            <Stat big="15 yrs" small="of price history" />
            <Stat big="3" small="price sources blended" />
            <Stat big="nightly" small="aggregation cadence" />
          </div>
        </Cell>
      </div>
    </section>
  );
}

function Cell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-thin bg-card p-6 transition hover:border-border-emphasis",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CellHeader({
  icon,
  eyebrow,
}: {
  icon: React.ReactNode;
  eyebrow: string;
}) {
  return (
    <div className="flex items-center gap-2 text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
      <span className="text-accent">{icon}</span>
      <span>{eyebrow}</span>
    </div>
  );
}

function SourceDot({ label, weight }: { label: string; weight: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-1.5 rounded-full bg-accent" />
        <span className="text-small text-text-primary">{label}</span>
      </div>
      <span className="text-micro font-mono font-tabular text-text-tertiary">
        w = {weight}
      </span>
    </div>
  );
}

function Stat({ big, small }: { big: string; small: string }) {
  return (
    <div>
      <div className="font-mono font-tabular text-3xl text-text-primary tabular-nums tracking-tight">
        {big}
      </div>
      <div className="mt-1 text-micro font-mono font-tabular text-text-tertiary">
        {small}
      </div>
    </div>
  );
}

function ActivityTicker({
  items,
}: {
  items: Array<{ id: string; text: string; delta?: number }>;
}) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % items.length);
    }, 2600);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div className="mt-6 h-[220px] overflow-hidden rounded-lg border border-border-thin bg-bg-raised p-4">
      <AnimatePresence mode="popLayout">
        {items.slice(idx, idx + 4).map((it, i) => (
          <motion.div
            key={`${it.id}-${idx}-${i}`}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1 - i * 0.2, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 py-2"
          >
            <span className="inline-flex size-1.5 shrink-0 rounded-full bg-success" />
            <span className="truncate text-small text-text-secondary">
              {it.text}
            </span>
            {it.delta !== undefined && (
              <span
                className={cn(
                  "ml-auto font-mono font-tabular text-micro tabular-nums",
                  it.delta >= 0 ? "text-success" : "text-danger",
                )}
              >
                {it.delta >= 0 ? "+" : ""}
                {it.delta.toFixed(2)}%
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
