import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MarketPagination } from "@/components/market/market-pagination";
import { fetchNewReleases } from "@/lib/queries";
import { NewReleaseCard } from "@/components/market-v2/new-release-card";
import { buildNewReleaseEntries } from "@/lib/queries/market-live";

export const metadata: Metadata = {
  title: "New Releases | BrickX",
  description:
    "The latest LEGO sets released this year and last — track first 30-day price action.",
};

interface NewReleasesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function NewReleasesPage({
  searchParams,
}: NewReleasesPageProps) {
  const raw = await searchParams;
  const page = Math.max(1, parseInt(String(raw.page ?? "1"), 10) || 1);

  const result = await fetchNewReleases(page);
  const entries = buildNewReleaseEntries(result.sets);

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
          New Releases
        </div>
        <h1 className="mt-2 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[56px]">
          Fresh on the shelf.
        </h1>
        <p className="mt-3 max-w-xl text-small text-text-secondary leading-relaxed">
          Sets released in the last 12 months. First 30-day price action is the
          best early signal for long-term appreciation.
        </p>
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 sm:px-10 lg:px-14">
        {entries.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <NewReleaseCard
                key={entry.set.id}
                entry={entry}
                setHrefPrefix="/sets"
              />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-small text-text-tertiary">
            No new releases found.
          </p>
        )}

        <MarketPagination
          currentPage={result.page}
          totalPages={result.totalPages}
          totalCount={result.totalCount}
          pageSize={result.pageSize}
          basePath="/market/new-releases"
        />
      </div>
    </main>
  );
}
