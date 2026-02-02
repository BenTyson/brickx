import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { SetCard } from "@/components/set-card";
import { MarketPagination } from "@/components/market/market-pagination";
import { fetchNewReleases } from "@/lib/queries";

export const metadata: Metadata = {
  title: "New Releases | BrickX",
  description:
    "The latest LEGO sets released this year and last, fresh on the market.",
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

  return (
    <div className="py-8">
      <PageContainer className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Releases</h1>
          <p className="text-muted-foreground mt-1">
            LEGO sets released in the current and previous year.
          </p>
        </div>

        {result.sets.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.sets.map((set) => (
              <SetCard key={set.id} set={set} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground py-12 text-center">
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
      </PageContainer>
    </div>
  );
}
