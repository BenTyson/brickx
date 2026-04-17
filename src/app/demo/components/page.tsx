"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn, SlideUp } from "@/components/motion";
import { Sparkline } from "@/components/charts/sparkline";
import { PriceChartV2 } from "@/components/charts/price-chart-v2";
import { StatCardV2 } from "@/components/ui/stat-card-v2";
import { SetCardV2 } from "@/components/ui/set-card-v2";
import { DataTableV2, type DataTableColumn } from "@/components/ui/data-table-v2";
import { DeltaChip } from "@/components/ui/delta-chip";
import { BidAskPair } from "@/components/ui/bid-ask-pair";
import { IndexBadge } from "@/components/ui/index-badge";
import { CommandPalette, type CommandItem } from "@/components/ui/command-palette";
import { correlatedPair, datedRandomWalk, randomWalk } from "@/lib/mock/series";

/* ── mock data ──────────────────────────────────────────────────── */

const portfolioSeries = randomWalk({
  points: 90,
  start: 10800,
  vol: 0.012,
  drift: 0.002,
  seed: 1,
});
const portfolioSmall = randomWalk({ points: 30, start: 100, vol: 0.018, seed: 2 });
const unrealizedSeries = randomWalk({ points: 60, start: 900, vol: 0.025, seed: 3 });
const declineSeries = randomWalk({ points: 60, start: 120, vol: 0.014, drift: -0.003, seed: 4 });

const { new: pcNew, used: pcUsed } = correlatedPair({
  days: 365,
  newStart: 180,
  usedStart: 120,
  seed: 21,
});
const pcBrickLink = datedRandomWalk({ days: 365, start: 175, vol: 0.022, seed: 31 });
const pcBrickOwl = datedRandomWalk({ days: 365, start: 168, vol: 0.02, seed: 41 });

const events = [
  { date: pcNew[Math.floor(pcNew.length * 0.3)].date, label: "Retirement announced", kind: "retirement" as const },
  { date: pcNew[Math.floor(pcNew.length * 0.72)].date, label: "Re-release rumor", kind: "re-release" as const },
];

type MoverRow = {
  id: string;
  name: string;
  theme: string;
  price: number;
  delta: number;
  series: number[];
};
const movers: MoverRow[] = [
  { id: "10294", name: "Titanic", theme: "Creator Expert", price: 684, delta: 12.4, series: randomWalk({ points: 30, start: 600, vol: 0.018, drift: 0.004, seed: 51 }).map((p) => p.v) },
  { id: "75192", name: "Millennium Falcon UCS", theme: "Star Wars", price: 982, delta: 4.1, series: randomWalk({ points: 30, start: 940, vol: 0.012, seed: 52 }).map((p) => p.v) },
  { id: "10255", name: "Assembly Square", theme: "Modular", price: 412, delta: -2.8, series: randomWalk({ points: 30, start: 425, vol: 0.02, drift: -0.002, seed: 53 }).map((p) => p.v) },
  { id: "42115", name: "Lamborghini Sián", theme: "Technic", price: 488, delta: 8.9, series: randomWalk({ points: 30, start: 450, vol: 0.022, drift: 0.003, seed: 54 }).map((p) => p.v) },
  { id: "21322", name: "Pirates of Barracuda Bay", theme: "Ideas", price: 620, delta: -5.2, series: randomWalk({ points: 30, start: 640, vol: 0.018, drift: -0.003, seed: 55 }).map((p) => p.v) },
  { id: "10297", name: "Boutique Hotel", theme: "Modular", price: 318, delta: 1.7, series: randomWalk({ points: 30, start: 310, vol: 0.01, seed: 56 }).map((p) => p.v) },
];

const moverColumns: DataTableColumn<MoverRow>[] = [
  { key: "id", header: "ID", width: 72, cellClassName: "font-mono font-tabular text-text-tertiary", cell: (r) => r.id },
  { key: "name", header: "Set", cell: (r) => <span className="text-text-primary">{r.name}</span>, sort: (a, b) => a.name.localeCompare(b.name) },
  { key: "theme", header: "Theme", cell: (r) => r.theme },
  { key: "spark", header: "30d", width: 90, cell: (r) => <Sparkline data={r.series} width={70} height={20} /> },
  { key: "price", header: "Market", align: "right", cellClassName: "font-mono font-tabular tabular-nums text-text-primary", sort: (a, b) => a.price - b.price, cell: (r) => `$${r.price.toFixed(0)}` },
  { key: "delta", header: "Δ 30d", align: "right", sort: (a, b) => a.delta - b.delta, cell: (r) => <DeltaChip value={r.delta} size="sm" hideIcon /> },
];

const setCards = [
  { id: "10294", name: "Titanic", theme: "Creator Expert", year: 2021, status: "available" as const, imgUrl: null, msrp: 629.99, current: 684, delta: 12.4, series: randomWalk({ points: 45, start: 620, vol: 0.018, drift: 0.004, seed: 101 }) },
  { id: "75192", name: "Millennium Falcon Ultimate Collector Series", theme: "Star Wars", year: 2017, status: "retired" as const, imgUrl: null, msrp: 799.99, current: 982, delta: 4.1, series: randomWalk({ points: 45, start: 940, vol: 0.012, seed: 102 }) },
  { id: "10255", name: "Assembly Square", theme: "Modular", year: 2017, status: "retiring-soon" as const, imgUrl: null, msrp: 279.99, current: 412, delta: -2.8, series: randomWalk({ points: 45, start: 425, vol: 0.02, drift: -0.002, seed: 103 }) },
  { id: "21322", name: "Pirates of Barracuda Bay", theme: "Ideas", year: 2020, status: "exclusive" as const, imgUrl: null, msrp: 199.99, current: 620, delta: 18.5, series: randomWalk({ points: 45, start: 550, vol: 0.02, drift: 0.008, seed: 104 }) },
];

const cmdItems: CommandItem[] = [
  ...movers.map<CommandItem>((m) => ({
    id: `set-${m.id}`,
    title: m.name,
    subtitle: `${m.id} · ${m.theme}`,
    group: "Sets",
    href: `#${m.id}`,
    keywords: [m.theme],
  })),
  { id: "idx-brickx-100", title: "BrickX 100", subtitle: "Flagship index", group: "Indices", href: "#idx" },
  { id: "idx-heat", title: "Star Wars Heat Index", subtitle: "Theme index", group: "Indices", href: "#heat" },
  { id: "theme-modular", title: "Modular Buildings", subtitle: "Theme", group: "Themes", href: "#modular" },
  { id: "theme-ideas", title: "Ideas", subtitle: "Theme", group: "Themes", href: "#ideas" },
];

/* ── section wrapper ───────────────────────────────────────────── */

function Section({
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border-thin py-16">
      <div className="mb-8 flex items-start gap-8">
        <span className="text-micro font-mono font-tabular text-text-quaternary">
          {index}
        </span>
        <div>
          <h2 className="text-h3 text-text-primary">{title}</h2>
          {description && (
            <p className="text-small mt-2 max-w-[580px] text-text-tertiary">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

/* ── page ──────────────────────────────────────────────────────── */

export default function ComponentsDemoPage() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 lg:px-14">
      <FadeIn className="mb-20">
        <div className="text-micro font-mono font-tabular text-text-tertiary">
          D2 · Primitives · v2
        </div>
        <h1 className="text-h1 font-serif-display mt-6 text-text-primary">
          Kitchen sink.
        </h1>
        <p className="text-body mt-6 max-w-[560px] text-text-secondary">
          Every redesigned primitive in one place — the building blocks the
          rest of the demo namespace composes from. Mock data throughout.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-border-emphasis bg-bg-raised px-4 py-2 text-small text-text-secondary transition hover:bg-bg-overlay"
          >
            <span>Open command palette</span>
            <kbd className="rounded border border-border-thin bg-bg-base px-1.5 py-0.5 text-[10px] font-mono font-tabular text-text-tertiary">
              ⌘K
            </kbd>
          </button>
          <Link
            href="/demo/tokens"
            className="text-small inline-flex items-center gap-1 text-text-tertiary transition hover:text-text-primary"
          >
            D1 tokens gallery
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </FadeIn>

      <Section
        index="01"
        title="Sparkline"
        description="Monotone bezier, gradient area fill (stop 0.4 → 0), no axes. Auto-tone by first-vs-last delta. 70×20 default fits inside data-table rows."
      >
        <div className="flex flex-wrap items-center gap-8">
          <SwatchBlock label="positive">
            <Sparkline data={portfolioSmall} />
          </SwatchBlock>
          <SwatchBlock label="negative">
            <Sparkline data={declineSeries} />
          </SwatchBlock>
          <SwatchBlock label="accent override">
            <Sparkline data={unrealizedSeries} tone="accent" width={120} height={32} />
          </SwatchBlock>
          <SwatchBlock label="large · area off">
            <Sparkline data={portfolioSeries} width={220} height={48} area={false} />
          </SwatchBlock>
        </div>
      </Section>

      <Section
        index="02"
        title="StatCard v2"
        description="Oversized count-up value, 90-day sparkline, delta chip. Hover reveals the 1M / 3M / 1Y range toggle."
      >
        <SlideUp delay={0.05}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCardV2
              label="Portfolio value"
              value={12480}
              prefix="$"
              decimals={0}
              series={portfolioSeries}
              delta={11.11}
              deltaLabel="past 90 days"
              ranges={{
                "1M": { value: 11950, delta: 3.2 },
                "3M": { value: 12480, delta: 11.11 },
                "1Y": { value: 12480, delta: 24.9 },
              }}
            />
            <StatCardV2
              label="Unrealized gain"
              value={2140}
              prefix="$"
              series={unrealizedSeries}
              delta={18.5}
              deltaLabel="all-time"
            />
            <StatCardV2
              label="Sets tracked"
              value={142}
              series={portfolioSmall}
              delta={5.9}
              deltaLabel="vs last month"
            />
            <StatCardV2
              label="Avg. appreciation"
              value={11.4}
              suffix="%"
              decimals={1}
              series={declineSeries}
              delta={-0.8}
              deltaLabel="vs prior period"
            />
          </div>
        </SlideUp>
      </Section>

      <Section
        index="03"
        title="SetCard v2"
        description="Premium hover (scale 1.02 + border glow), sparkline strip beneath image, status pill, MSRP → current with directional arrow."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {setCards.map((s) => (
            <SetCardV2
              key={s.id}
              id={s.id}
              name={s.name}
              theme={s.theme}
              year={s.year}
              status={s.status}
              imgUrl={s.imgUrl ?? undefined}
              msrp={s.msrp}
              currentValue={s.current}
              pctChange={s.delta}
              sparkline={s.series}
              href={`#set-${s.id}`}
            />
          ))}
        </div>
      </Section>

      <Section
        index="04"
        title="PriceChart v2"
        description="Gradient area fill, hairline crosshair tooltip with tabular numerics, range chips, series toggles, event annotations."
      >
        <div className="rounded-xl border border-border-thin bg-card p-6">
          <PriceChartV2
            series={pcNew}
            usedSeries={pcUsed}
            sources={{
              bricklink: pcBrickLink,
              brickowl: pcBrickOwl,
            }}
            events={events}
            defaultRange="6M"
            height={340}
          />
        </div>
      </Section>

      <Section
        index="05"
        title="DataTable v2"
        description="No zebra, hairline borders, sticky header, monospace numerics, sparkline column, row hover glow. Click headers to sort. Skeleton pulse available via the loading prop."
      >
        <DataTableV2
          columns={moverColumns}
          data={movers}
          getRowKey={(r) => r.id}
        />
        <div className="mt-8">
          <div className="text-micro font-mono font-tabular text-text-tertiary mb-3">
            Skeleton loading state
          </div>
          <DataTableV2 columns={moverColumns} data={[]} loading skeletonRows={4} />
        </div>
      </Section>

      <Section
        index="06"
        title="BidAskPair"
        description="StockX-style dual display — highest bid in green, lowest ask in red, centered on hairline divider. Used on set-detail hero."
      >
        <div className="flex flex-wrap items-start gap-6">
          <BidAskPair bid={612} ask={684} size="md" />
          <BidAskPair bid={982} ask={null} size="lg" />
        </div>
      </Section>

      <Section
        index="07"
        title="Index badge"
        description="Membership marker for BrickX 100, theme heat indices, and other curated groupings. Optional slug links to the index page."
      >
        <div className="flex flex-wrap gap-2">
          <IndexBadge name="BrickX 100" tone="brand" />
          <IndexBadge name="BrickX 100" tone="brand" figure="+2.3%" />
          <IndexBadge name="Star Wars Heat" tone="warm" />
          <IndexBadge name="Modulars" tone="cool" />
          <IndexBadge name="Retired Gold" tone="neutral" />
          <IndexBadge name="Ideas Index" tone="brand" size="sm" />
        </div>
      </Section>

      <Section
        index="08"
        title="DeltaChip"
        description="Every gain/loss figure pairs with the same chip. Tabular numerics, directional glyph, tone auto-derived from sign."
      >
        <div className="flex flex-wrap gap-2">
          <DeltaChip value={12.4} />
          <DeltaChip value={-2.8} />
          <DeltaChip value={0} />
          <DeltaChip value={8.1} suffix="30d" />
          <DeltaChip value={-4.2} size="sm" />
          <DeltaChip value={5.5} hideIcon />
        </div>
      </Section>

      <Section
        index="09"
        title="Command palette (⌘K)"
        description="Fuzzy search across sets, themes, indices, and minifigs — keyboard-first, arrow-navigable, with thumbnails in results."
      >
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="inline-flex items-center gap-3 rounded-xl border border-border-thin bg-bg-raised px-4 py-3 text-small text-text-tertiary transition hover:border-border-emphasis hover:text-text-primary"
        >
          <span>Search sets, themes, minifigs…</span>
          <kbd className="rounded border border-border-thin bg-bg-base px-1.5 py-0.5 text-[10px] font-mono font-tabular text-text-tertiary">
            ⌘K
          </kbd>
        </button>
      </Section>

      <CommandPalette
        items={cmdItems}
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
      />
    </main>
  );
}

function SwatchBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-micro font-mono font-tabular text-text-tertiary">
        {label}
      </div>
      <div className="flex h-12 items-center rounded-md bg-card px-4">
        {children}
      </div>
    </div>
  );
}
