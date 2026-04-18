import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  HOLDINGS,
  portfolioSnapshot,
  themeAllocations,
  topMovers,
  WISHLIST,
  riskReturnSeries,
} from "@/lib/mock/portfolio";
import { PortfolioHero } from "@/components/portfolio-v2/portfolio-hero";
import { AllocationDonut } from "@/components/portfolio-v2/allocation-donut";
import { AllocationTreemap } from "@/components/portfolio-v2/allocation-treemap";
import { RiskReturnScatter } from "@/components/portfolio-v2/risk-return-scatter";
import { AttributionCard } from "@/components/portfolio-v2/attribution-card";
import { TopMovers } from "@/components/portfolio-v2/top-movers";
import { HoldingsTable } from "@/components/portfolio-v2/holdings-table";
import { CollectionsStrip } from "@/components/portfolio-v2/collections-strip";
import { WishlistGrid } from "@/components/portfolio-v2/wishlist-grid";

export const metadata: Metadata = {
  title: "Portfolio demo · BrickX",
  robots: { index: false, follow: false },
};

export default function PortfolioDemoPage() {
  const snapshot = portfolioSnapshot();
  const allocations = themeAllocations();
  const movers = topMovers();
  const scatter = riskReturnSeries();

  return (
    <main className="bg-bg-base pb-24">
      <div className="mx-auto max-w-[1320px] px-6 pb-6 pt-10 sm:px-10 lg:px-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
              Portfolio · demo
            </div>
            <h1 className="mt-2 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[56px]">
              The whole shelf, priced every night.
            </h1>
          </div>
          <Link
            href="/demo/portfolio/empty"
            className="inline-flex items-center gap-1 text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary transition hover:text-text-primary"
          >
            View empty state
            <ArrowUpRight className="size-3" aria-hidden />
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 sm:px-10 lg:px-14">
        <PortfolioHero snapshot={snapshot} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <AllocationDonut allocations={allocations} total={snapshot.totalValue} />
          <AttributionCard allocations={allocations} />
        </div>

        <AllocationTreemap holdings={HOLDINGS} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <TopMovers gainers={movers.gainers} losers={movers.losers} />
          <RiskReturnScatter points={scatter} />
        </div>

        <CollectionsStrip />

        <HoldingsTable holdings={HOLDINGS} />

        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <div className="text-micro font-mono font-tabular text-text-tertiary">
                Wishlist · {WISHLIST.length} sets
              </div>
              <div className="mt-1 font-serif-display text-[22px] leading-tight text-text-primary">
                Waiting for the right number.
              </div>
            </div>
            <Link
              href="/demo/wishlist"
              className="inline-flex items-center gap-1 text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary transition hover:text-text-primary"
            >
              Full wishlist
              <ArrowUpRight className="size-3" aria-hidden />
            </Link>
          </div>
          <WishlistGrid items={WISHLIST.slice(0, 4)} />
        </section>

        <footer className="border-t border-border-thin pt-6 text-micro font-mono font-tabular tracking-[0.06em] text-text-quaternary">
          Demo workbench · every figure is mocked. Series are deterministic per
          holding.
        </footer>
      </div>
    </main>
  );
}
