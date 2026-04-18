import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { FadeIn, SlideUp } from "@/components/motion";
import { CountUp } from "@/components/motion";
import { DeltaChip } from "@/components/ui/delta-chip";
import { IndexBadge } from "@/components/ui/index-badge";
import { PriceChartV2 } from "@/components/charts/price-chart-v2";
import { CatalogListView } from "@/components/catalog-v2/catalog-list-view";
import { StatCardV2 } from "@/components/ui/stat-card-v2";
import {
  CATALOG_THEMES,
  findTheme,
  setsForTheme,
  themeIndexSeries,
} from "@/lib/mock/catalog";
import type { DatedPoint } from "@/lib/mock/series";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATALOG_THEMES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const theme = findTheme(slug);
  if (!theme) return { robots: { index: false, follow: false } };
  return {
    title: `${theme.name} index — BrickX Demo`,
    description: theme.tagline,
    robots: { index: false, follow: false },
  };
}

export default async function ThemeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const theme = findTheme(slug);
  if (!theme) notFound();

  const sets = setsForTheme(slug);
  const series = themeIndexSeries(theme);
  const indexValue = series[series.length - 1].v;

  // Convert seeded SeriesPoint[] → DatedPoint[] so the chart can use its date axis.
  const endDate = new Date();
  const dated: DatedPoint[] = series.map((p, i) => {
    const d = new Date(endDate);
    d.setDate(d.getDate() - (series.length - 1 - i));
    return { date: d.toISOString().slice(0, 10), v: p.v };
  });

  const weekDelta = percentChange(series, 7);
  const monthDelta = percentChange(series, 30);

  const stats = {
    setsTracked: sets.length,
    avgValue: Math.round(
      sets.reduce((a, s) => a + s.currentValue, 0) / Math.max(sets.length, 1),
    ),
    retiredCount: sets.filter((s) => s.status === "retired").length,
    topReturn: Math.max(...sets.map((s) => s.appreciation)),
  };

  const topMovers = [...sets]
    .sort((a, b) => b.pctChange30d - a.pctChange30d)
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-[1320px] px-6 pb-24 pt-10 sm:px-10 lg:px-14">
      {/* breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-micro font-mono font-tabular uppercase tracking-[0.06em] text-text-tertiary"
      >
        <Link href="/demo/themes" className="transition hover:text-text-primary">
          Themes
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-text-secondary">{theme.name}</span>
      </nav>

      {/* hero */}
      <FadeIn className="mt-8">
        <div className="flex items-center gap-3">
          <IndexBadge name={theme.name} tone={theme.tone} />
          <span className="text-micro font-mono font-tabular text-text-tertiary">
            {theme.setCount} constituents · rebalanced monthly
          </span>
        </div>
        <h1 className="mt-5 max-w-[820px] text-h1 font-serif-display italic text-text-primary">
          {theme.tagline}
        </h1>
        <div className="mt-8 flex flex-wrap items-end gap-6">
          <div className="flex items-baseline gap-4">
            <CountUp
              value={indexValue}
              decimals={2}
              className="font-mono font-tabular tabular-nums text-text-primary text-5xl tracking-tight lg:text-[64px]"
            />
            <DeltaChip value={monthDelta} />
          </div>
          <div className="text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
            Index level · base 100 · 180d
          </div>
        </div>
      </FadeIn>

      {/* headline stats */}
      <SlideUp delay={0.05} className="mt-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardV2
            label="Index level"
            value={indexValue}
            decimals={2}
            series={series}
            delta={monthDelta}
            deltaLabel="past 30d"
          />
          <StatCardV2
            label="Sets tracked"
            value={stats.setsTracked}
            series={series.slice(-30)}
            delta={weekDelta}
            deltaLabel="past 7d"
          />
          <StatCardV2
            label="Avg market value"
            value={stats.avgValue}
            prefix="$"
            decimals={0}
            series={series.slice(-60)}
            delta={theme.avgAppreciation}
            deltaLabel="since release"
          />
          <StatCardV2
            label="Top constituent return"
            value={stats.topReturn}
            suffix="%"
            decimals={1}
            series={series}
            delta={stats.topReturn}
            deltaLabel="all-time"
          />
        </div>
      </SlideUp>

      {/* chart */}
      <section className="mt-16" aria-labelledby="chart-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2
              id="chart-heading"
              className="text-h3 font-serif-display italic text-text-primary"
            >
              Index history
            </h2>
            <p className="mt-1 text-small text-text-secondary">
              Float-weighted aggregate of {theme.setCount} constituents.
              Rebalanced the first of each month.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-border-thin bg-card p-6">
          <PriceChartV2
            series={dated}
            defaultRange="6M"
            height={320}
          />
        </div>
      </section>

      {/* constituents */}
      <section className="mt-16" aria-labelledby="constituents-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2
              id="constituents-heading"
              className="text-h3 font-serif-display italic text-text-primary"
            >
              Constituents
            </h2>
            <p className="mt-1 text-small text-text-secondary">
              Every set in this theme, sortable by market value, appreciation,
              or 30-day change.
            </p>
          </div>
          <Link
            href={`/demo/sets?theme=${theme.slug}`}
            className="text-small text-text-tertiary transition hover:text-text-primary"
          >
            Open in catalog →
          </Link>
        </div>
        <CatalogListView sets={sets} />
      </section>

      {/* top movers */}
      {topMovers.length > 0 && (
        <section className="mt-16" aria-labelledby="movers-heading">
          <div className="mb-6 flex items-center gap-3">
            <h2
              id="movers-heading"
              className="text-micro font-mono font-tabular uppercase tracking-[0.1em] text-text-tertiary"
            >
              Top movers (30d)
            </h2>
            <span className="h-px flex-1 bg-border-thin" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topMovers.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-border-thin bg-card p-5"
              >
                <div className="text-micro font-mono font-tabular text-text-tertiary">
                  {s.id} · {s.year}
                </div>
                <div className="mt-2 line-clamp-2 text-small text-text-primary">
                  {s.name}
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-2">
                  <span className="font-mono font-tabular tabular-nums text-text-primary">
                    ${s.currentValue.toLocaleString()}
                  </span>
                  <DeltaChip value={s.pctChange30d} size="sm" hideIcon />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function percentChange(series: { v: number }[], windowDays: number): number {
  if (series.length < windowDays + 1) {
    const first = series[0]?.v ?? 0;
    const last = series[series.length - 1]?.v ?? 0;
    return first === 0 ? 0 : ((last - first) / first) * 100;
  }
  const start = series[series.length - 1 - windowDays].v;
  const end = series[series.length - 1].v;
  return start === 0 ? 0 : ((end - start) / start) * 100;
}
