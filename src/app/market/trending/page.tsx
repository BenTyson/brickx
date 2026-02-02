import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { SetCard } from "@/components/set-card";
import { PeriodToggle } from "@/components/market/period-toggle";
import { MarketPagination } from "@/components/market/market-pagination";
import { fetchTrendingSets } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Trending Sets | BrickX",
  description:
    "LEGO sets with the biggest price movements over the past 7 and 30 days.",
};

interface TrendingPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function TrendingPage({
  searchParams,
}: TrendingPageProps) {
  const raw = await searchParams;
  const period = raw.period === "30d" ? ("30d" as const) : ("7d" as const);
  const page = Math.max(1, parseInt(String(raw.page ?? "1"), 10) || 1);

  const result = await fetchTrendingSets(period, page);

  return (
    <div className="py-8">
      <PageContainer className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trending Sets</h1>
            <p className="text-muted-foreground mt-1">
              Sets with the biggest price changes over the past{" "}
              {period === "7d" ? "7 days" : "30 days"}.
            </p>
          </div>
          <PeriodToggle currentPeriod={period} />
        </div>

        {result.sets.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.sets.map((set) => (
              <SetCard key={set.id} set={set} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground py-12 text-center">
            No trending sets found for this period.
          </p>
        )}

        <MarketPagination
          currentPage={result.page}
          totalPages={result.totalPages}
          totalCount={result.totalCount}
          pageSize={result.pageSize}
          basePath="/market/trending"
        />
      </PageContainer>
    </div>
  );
}
