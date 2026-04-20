import type { Metadata } from "next";
import { fetchPortfolioSummary } from "@/lib/queries";
import {
  fetchLivePortfolioData,
  fetchLiveWishlist,
  buildLiveSnapshot,
  buildLiveThemeAllocations,
  buildLiveTopMovers,
  buildLiveCollectionRows,
} from "@/lib/queries/portfolio-live";
import { themeColor } from "@/lib/mock/portfolio";
import { PortfolioHero } from "@/components/portfolio-v2/portfolio-hero";
import { AllocationDonut } from "@/components/portfolio-v2/allocation-donut";
import { AllocationTreemap } from "@/components/portfolio-v2/allocation-treemap";
import { AttributionCard } from "@/components/portfolio-v2/attribution-card";
import { TopMovers } from "@/components/portfolio-v2/top-movers";
import { HoldingsTable } from "@/components/portfolio-v2/holdings-table";
import {
  CollectionsStrip,
  type CollectionsStripRow,
} from "@/components/portfolio-v2/collections-strip";
import { WishlistGrid } from "@/components/portfolio-v2/wishlist-grid";
import { EmptyPortfolio } from "@/components/portfolio-v2/empty-portfolio";

export const metadata: Metadata = {
  title: "Portfolio | BrickX",
  description:
    "Track the performance of your LEGO portfolio — total value, allocation, movers, and history.",
};

export default async function PortfolioPage() {
  const [summary, liveData, wishlist] = await Promise.all([
    fetchPortfolioSummary(),
    fetchLivePortfolioData(),
    fetchLiveWishlist(),
  ]);

  if (summary.total_sets === 0 || liveData.holdings.length === 0) {
    return (
      <main className="bg-bg-base pb-24">
        <div className="mx-auto max-w-[1320px] px-6 pb-6 pt-10 sm:px-10 lg:px-14">
          <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
            Portfolio
          </div>
        </div>
        <div className="mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-14">
          <EmptyPortfolio addHref="/sets" importHref="/collections" />
        </div>
      </main>
    );
  }

  const snapshot = buildLiveSnapshot(liveData.holdings, summary);
  const allocations = buildLiveThemeAllocations(liveData.holdings);
  const movers = buildLiveTopMovers(liveData.holdings, 5);
  const collectionRows = buildLiveCollectionRows(
    liveData.collections,
    liveData.holdings,
  );

  const stripRows: CollectionsStripRow[] = collectionRows.map((r) => ({
    id: r.id,
    name: r.name,
    setCount: r.setCount,
    itemCount: r.itemCount,
    value: r.value,
    delta30d: r.delta30d,
    gainPct: r.gainPct,
    series: r.sparkline,
    tintColor: themeColor(r.themeSlug),
  }));

  return (
    <main className="bg-bg-base pb-24">
      <div className="mx-auto max-w-[1320px] px-6 pb-6 pt-10 sm:px-10 lg:px-14">
        <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
          Portfolio
        </div>
        <h1 className="mt-2 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[56px]">
          The whole shelf, priced every night.
        </h1>
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 sm:px-10 lg:px-14">
        <PortfolioHero snapshot={snapshot} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <AllocationDonut
            allocations={allocations}
            total={snapshot.totalValue}
          />
          <AttributionCard allocations={allocations} />
        </div>

        <AllocationTreemap holdings={liveData.holdings} />

        <TopMovers
          gainers={movers.gainers}
          losers={movers.losers}
          setHrefPrefix="/sets"
        />

        <CollectionsStrip rows={stripRows} hrefPrefix="/collections" />

        <HoldingsTable holdings={liveData.holdings} setHrefPrefix="/sets" />

        {wishlist.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="text-micro font-mono font-tabular text-text-tertiary">
                  Wishlist · {wishlist.length} {wishlist.length === 1 ? "set" : "sets"}
                </div>
                <div className="mt-1 font-serif-display text-[22px] leading-tight text-text-primary">
                  Waiting for the right number.
                </div>
              </div>
            </div>
            <WishlistGrid items={wishlist.slice(0, 8)} setHrefPrefix="/sets" />
          </section>
        )}
      </div>
    </main>
  );
}
