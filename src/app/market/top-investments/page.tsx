import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
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
    <div className="py-8">
      <PageContainer className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Top Investments</h1>
          <p className="text-muted-foreground mt-1">
            Sets ranked by investment score. Filter by MSRP to find
            opportunities in your budget.
          </p>
        </div>

        <PriceRangeFilter currentMin={priceMin} currentMax={priceMax} />

        {result.sets.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.sets.map((set) => (
              <SetCard key={set.id} set={set} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground py-12 text-center">
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
      </PageContainer>
    </div>
  );
}
