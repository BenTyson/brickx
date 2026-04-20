import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SetCard } from "@/components/set-card";
import { PriceRangeFilter } from "@/components/market/price-range-filter";
import { MarketPagination } from "@/components/market/market-pagination";
import { fetchTopInvestments } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Top Investments | BrickX",
  description:
    "Highest-rated LEGO sets by investment score across all price ranges.",
};

interface TopInvestmentsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function TopInvestmentsPage({
  searchParams,
}: TopInvestmentsPageProps) {
  const raw = await searchParams;
  const page = Math.max(1, parseInt(String(raw.page ?? "1"), 10) || 1);
  const priceMin = raw.priceMin ? parseFloat(String(raw.priceMin)) : undefined;
  const priceMax = raw.priceMax ? parseFloat(String(raw.priceMax)) : undefined;

  const result = await fetchTopInvestments(
    isNaN(priceMin as number) ? undefined : priceMin,
    isNaN(priceMax as number) ? undefined : priceMax,
    page,
  );

  return (
    <main className="bg-bg-base pb-24">
      <div className="mx-auto max-w-[1320px] px-6 pt-8 sm:px-10 lg:px-14">
        <Link
          href="/market"
          className="inline-flex items-center gap-1 text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary transition hover:text-text-primary"
        >
          <ChevronLeft className="size-3" aria-hidden />
          Market hub
        </Link>
      </div>

      <div className="mx-auto max-w-[1320px] px-6 pb-6 pt-4 sm:px-10 lg:px-14">
        <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
          Top Investments
        </div>
        <h1 className="mt-2 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[56px]">
          Scored and ranked.
        </h1>
        <p className="mt-3 max-w-xl text-small text-text-secondary leading-relaxed">
          Sets ranked by proprietary investment score — a blend of price trend,
          retirement proximity, and historical appreciation. Filter by MSRP.
        </p>
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 sm:px-10 lg:px-14">
        <PriceRangeFilter currentMin={priceMin} currentMax={priceMax} />

        {result.sets.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.sets.map((set) => (
              <SetCard key={set.id} set={set} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-small text-text-tertiary">
            No sets found matching the specified criteria.
          </p>
        )}

        <MarketPagination
          currentPage={result.page}
          totalPages={result.totalPages}
          totalCount={result.totalCount}
          pageSize={result.pageSize}
          basePath="/market/top-investments"
        />
      </div>
    </main>
  );
}
