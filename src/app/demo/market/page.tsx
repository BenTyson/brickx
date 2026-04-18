import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INDICES, biggestMovers, NEWS_FEED } from "@/lib/mock/indices";
import { IndexHero } from "@/components/market-v2/index-hero";
import { IndexCard } from "@/components/market-v2/index-card";
import { MoversStrip } from "@/components/market-v2/movers-strip";
import { NewsFeed } from "@/components/market-v2/news-feed";
import { ThemeHeatmap } from "@/components/market-v2/theme-heatmap";

export const metadata: Metadata = {
  title: "Market Intelligence demo · BrickX",
  robots: { index: false, follow: false },
};

const NAV_LINKS = [
  { href: "/demo/market/trending", label: "Trending" },
  { href: "/demo/market/retiring", label: "Retiring Soon" },
  { href: "/demo/market/new", label: "New Releases" },
  { href: "/demo/market/news", label: "News" },
];

export default function MarketHubPage() {
  const bx100 = INDICES.find((i) => i.slug === "brickx-100")!;
  const featuredIndices = INDICES.filter((i) => i.slug !== "brickx-100");
  const { gainers, losers } = biggestMovers(4);

  return (
    <main className="bg-bg-base pb-24">
      {/* Page header */}
      <div className="mx-auto max-w-[1320px] px-6 pb-6 pt-10 sm:px-10 lg:px-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
              Market Intelligence · demo
            </div>
            <h1 className="mt-2 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[56px]">
              LEGO as an asset class.
            </h1>
          </div>
          {/* Sub-nav */}
          <nav className="flex flex-wrap items-center gap-1" aria-label="Market sections">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-border-thin bg-bg-raised px-3 py-1.5 text-micro font-mono font-tabular text-text-secondary transition hover:border-border-emphasis hover:text-text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 sm:px-10 lg:px-14">
        {/* BrickX 100 hero */}
        <IndexHero index={bx100} />

        {/* Featured indices grid */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-micro font-mono font-tabular text-text-tertiary">
              Named indices
            </div>
            <Link
              href="/demo/market/indices/brickx-100"
              className="inline-flex items-center gap-1 text-micro font-mono font-tabular text-accent hover:underline"
            >
              View all
              <ArrowRight className="size-3" aria-hidden />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredIndices.map((index) => (
              <IndexCard key={index.slug} index={index} />
            ))}
          </div>
        </div>

        {/* Biggest movers */}
        <MoversStrip gainers={gainers} losers={losers} />

        {/* Lower grid: heatmap + news */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <ThemeHeatmap />
          <div className="flex flex-col gap-4">
            <NewsFeed items={NEWS_FEED} limit={4} />
            <Link
              href="/demo/market/news"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border-thin bg-bg-raised px-4 py-2.5 text-small font-mono font-tabular text-text-secondary transition hover:border-border-emphasis hover:text-text-primary"
            >
              All market news
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>

        {/* Quick links footer */}
        <div className="grid gap-3 border-t border-border-thin pt-6 sm:grid-cols-3">
          {[
            { href: "/demo/market/trending", label: "Trending Sets", sub: "Gainers & losers by period" },
            { href: "/demo/market/retiring", label: "Retiring Soon", sub: "Countdown chips + risk scores" },
            { href: "/demo/market/new", label: "New Releases", sub: "First 30-day price charts" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between rounded-xl border border-border-thin bg-bg-raised p-4 transition hover:border-border-emphasis"
            >
              <div>
                <div className="text-small font-medium text-text-primary transition group-hover:text-accent-hover">
                  {l.label}
                </div>
                <div className="mt-0.5 text-micro font-mono font-tabular text-text-tertiary">
                  {l.sub}
                </div>
              </div>
              <ArrowRight className="size-4 text-text-quaternary transition group-hover:text-accent" aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
