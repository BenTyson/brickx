import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  COLLECTIONS,
  findCollection,
  holdingsInCollection,
  portfolioSnapshot,
  themeAllocations,
  topMovers,
  themeColor,
} from "@/lib/mock/portfolio";
import { PortfolioHero } from "@/components/portfolio-v2/portfolio-hero";
import { AllocationDonut } from "@/components/portfolio-v2/allocation-donut";
import { AttributionCard } from "@/components/portfolio-v2/attribution-card";
import { TopMovers } from "@/components/portfolio-v2/top-movers";
import { HoldingsTable } from "@/components/portfolio-v2/holdings-table";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const c = findCollection(id);
  if (!c) return { title: "Collection · BrickX demo", robots: { index: false } };
  return {
    title: `${c.name} · collection · BrickX demo`,
    robots: { index: false, follow: false },
  };
}

export default async function CollectionDetailDemoPage({ params }: PageProps) {
  const { id } = await params;
  const c = findCollection(id);
  if (!c) notFound();

  const holdings = holdingsInCollection(id);
  if (holdings.length === 0) notFound();

  const snapshot = portfolioSnapshot(holdings);
  const allocations = themeAllocations(holdings);
  const movers = topMovers(holdings, 4);
  const tint = themeColor(holdings[0]?.set.themeSlug ?? "");

  return (
    <main className="bg-bg-base pb-24">
      <div className="mx-auto max-w-[1320px] px-6 pb-6 pt-10 sm:px-10 lg:px-14">
        <Link
          href="/demo/portfolio"
          className="inline-flex items-center gap-1 text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary transition hover:text-text-primary"
        >
          <ArrowLeft className="size-3" aria-hidden />
          All collections
        </Link>
        <div className="mt-4 flex items-start gap-4">
          <span
            className="mt-4 size-3 shrink-0 rounded-full"
            aria-hidden
            style={{ backgroundColor: tint }}
          />
          <div>
            <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
              Collection · demo
            </div>
            <h1 className="mt-2 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[52px]">
              {c.name}
            </h1>
            <p className="mt-3 max-w-xl text-body text-text-secondary">
              {c.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-micro font-mono font-tabular tabular-nums text-text-quaternary">
              <span>created {new Date(c.createdDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</span>
              <span>·</span>
              <span>{snapshot.setCount} sets · {snapshot.itemCount} items</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 sm:px-10 lg:px-14">
        <PortfolioHero
          snapshot={snapshot}
          label={`${c.name} · total value`}
          showCostBasis={false}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <AllocationDonut allocations={allocations} total={snapshot.totalValue} />
          <AttributionCard allocations={allocations} />
        </div>

        <TopMovers gainers={movers.gainers} losers={movers.losers} />

        <HoldingsTable holdings={holdings} />

        <footer className="border-t border-border-thin pt-6 text-micro font-mono font-tabular tracking-[0.06em] text-text-quaternary">
          Demo workbench · scoped to the {c.name.toLowerCase()} collection.
        </footer>
      </div>
    </main>
  );
}
