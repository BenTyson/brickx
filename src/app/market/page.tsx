import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TrendingUp, Archive, Sparkles, Trophy } from "lucide-react";
import { fetchTrendingSets } from "@/lib/queries";
import { TrendingTable } from "@/components/market-v2/trending-table";
import { buildTrendRows } from "@/lib/queries/market-live";

export const metadata: Metadata = {
  title: "Market Intelligence | BrickX",
  description:
    "Explore LEGO market trends — trending sets, retiring releases, new drops, and top investments.",
};

const HUBS = [
  {
    href: "/market/trending",
    label: "Trending",
    sub: "Gainers & losers by period",
    icon: TrendingUp,
  },
  {
    href: "/market/retiring",
    label: "Retiring Soon",
    sub: "Retirement windows & risk scores",
    icon: Archive,
  },
  {
    href: "/market/new-releases",
    label: "New Releases",
    sub: "First 30-day price charts",
    icon: Sparkles,
  },
  {
    href: "/market/top-investments",
    label: "Top Investments",
    sub: "Highest investment scores",
    icon: Trophy,
  },
];

export default async function MarketPage() {
  const trending = await fetchTrendingSets("30d", 1, 24);
  const rows = buildTrendRows(trending.sets, "30d");

  return (
    <main className="bg-bg-base pb-24">
      <div className="mx-auto max-w-[1320px] px-6 pb-6 pt-10 sm:px-10 lg:px-14">
        <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
          Market Intelligence
        </div>
        <h1 className="mt-2 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[56px]">
          LEGO as an asset class.
        </h1>
        <p className="mt-3 max-w-xl text-small text-text-secondary leading-relaxed">
          Trending movements, retirement windows, fresh drops, and scored
          investments across the catalog. Updated nightly.
        </p>
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 sm:px-10 lg:px-14">
        <div className="grid gap-3 sm:grid-cols-2">
          {HUBS.map((hub) => {
            const Icon = hub.icon;
            return (
              <Link
                key={hub.href}
                href={hub.href}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border-thin bg-bg-raised p-5 transition hover:-translate-y-[1px] hover:border-border-emphasis sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border-thin bg-bg-overlay text-accent">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </div>
                  <div>
                    <div className="text-small font-medium text-text-primary transition group-hover:text-accent-hover">
                      {hub.label}
                    </div>
                    <div className="mt-0.5 text-micro font-mono font-tabular text-text-tertiary">
                      {hub.sub}
                    </div>
                  </div>
                </div>
                <ArrowRight
                  className="size-4 text-text-quaternary transition group-hover:translate-x-0.5 group-hover:text-accent"
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>

        {(rows.gainers.length > 0 || rows.losers.length > 0) && (
          <TrendingTable
            defaultPeriod="30d"
            showLosers
            rows={rows}
            setHrefPrefix="/sets"
            hidePeriodToggle
          />
        )}
      </div>
    </main>
  );
}
