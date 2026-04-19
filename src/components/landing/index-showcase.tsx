"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/components/motion";
import { Sparkline } from "@/components/charts/sparkline";
import { IndexBadge } from "@/components/ui/index-badge";
import { DeltaChip } from "@/components/ui/delta-chip";
import { CountUp } from "@/components/motion/count-up";
import type { SeriesPoint } from "@/lib/mock/series";

interface IndexCard {
  slug: string;
  name: string;
  tone: "brand" | "warm" | "cool" | "neutral";
  value: number;
  delta: number;
  series: SeriesPoint[];
  description: string;
}

export function IndexShowcase({ cards }: { cards: IndexCard[] }) {
  const primary = cards[0];
  const rest = cards.slice(1);
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 lg:px-14">
      <ScrollReveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-micro font-mono font-tabular text-text-tertiary">
              02 · Named indices
            </div>
            <h2 className="mt-4 max-w-[720px] text-h2 font-serif-display italic text-text-primary">
              Think in baskets, not one-offs.
            </h2>
            <p className="mt-4 max-w-[560px] text-body text-text-secondary">
              BrickX indices group sets the way collectors actually think —
              flagship, theme heat, retired gold, modular. Each one has its
              own chart, constituents, and rebalance notes.
            </p>
          </div>
          <Link
            href="/market"
            className="hidden shrink-0 items-center gap-1 text-small text-text-tertiary transition hover:text-text-primary md:inline-flex"
          >
            Explore indices
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <PrimaryIndexCard card={primary} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {rest.map((c) => (
            <SmallIndexCard key={c.slug} card={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PrimaryIndexCard({ card }: { card: IndexCard }) {
  return (
    <div className="glow-accent relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-border-emphasis bg-card p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_80%_60%_at_20%_10%,black,transparent_70%)]"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 20% 10%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)",
        }}
      />
      <div className="relative flex items-center gap-3">
        <IndexBadge name={card.name} tone={card.tone} />
        <span className="text-micro font-mono font-tabular text-text-tertiary">
          Flagship · 100 constituents
        </span>
      </div>
      <div className="relative flex items-baseline gap-4">
        <CountUp
          value={card.value}
          decimals={2}
          className="font-mono font-tabular text-5xl text-text-primary tabular-nums tracking-tight lg:text-[64px]"
        />
        <DeltaChip value={card.delta} />
      </div>
      <p className="relative max-w-[480px] text-small text-text-secondary">
        {card.description}
      </p>
      <div className="relative">
        <Sparkline
          data={card.series}
          width={720}
          height={120}
          strokeWidth={1.75}
          tone="accent"
          className="w-full"
          showEndDot
        />
      </div>
    </div>
  );
}

function SmallIndexCard({ card }: { card: IndexCard }) {
  return (
    <div className="group rounded-xl border border-border-thin bg-card p-5 transition hover:border-border-emphasis">
      <div className="flex items-center justify-between">
        <IndexBadge name={card.name} tone={card.tone} size="sm" />
        <DeltaChip value={card.delta} size="sm" hideIcon />
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-mono font-tabular text-2xl text-text-primary tabular-nums tracking-tight">
          {card.value.toFixed(2)}
        </span>
      </div>
      <div className="mt-4">
        <Sparkline
          data={card.series}
          width={300}
          height={36}
          strokeWidth={1.25}
          className="w-full"
          showEndDot={false}
        />
      </div>
      <p className="mt-4 line-clamp-2 text-micro text-text-tertiary">
        {card.description}
      </p>
    </div>
  );
}
