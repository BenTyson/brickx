import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PeriodToggle } from "@/components/market/period-toggle";
import { MarketPagination } from "@/components/market/market-pagination";
import { fetchTrendingSets } from "@/lib/queries";
import { TrendingTable } from "@/components/market-v2/trending-table";
import { buildTrendRows } from "@/lib/queries/market-live";

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
  const rows = buildTrendRows(result.sets, period);

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
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
              Trending
            </div>
            <h1 className="mt-2 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[56px]">
              Who&rsquo;s moving.
            </h1>
            <p className="mt-3 max-w-xl text-small text-text-secondary leading-relaxed">
              Sets ranked by price change over the past{" "}
              {period === "7d" ? "7 days" : "30 days"}.
            </p>
          </div>
          <PeriodToggle currentPeriod={period} />
        </div>
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 sm:px-10 lg:px-14">
        {result.sets.length > 0 ? (
          <TrendingTable
            defaultPeriod={period}
            showLosers
            rows={rows}
            setHrefPrefix="/sets"
            hidePeriodToggle
          />
        ) : (
          <p className="py-12 text-center text-small text-text-tertiary">
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
      </div>
    </main>
  );
}
