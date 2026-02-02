import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { SetCard } from "@/components/set-card";
import { MarketPagination } from "@/components/market/market-pagination";
import { fetchRetiringSets } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Retiring Sets | BrickX",
  description:
    "Browse retired LEGO sets that may appreciate in value on the secondary market.",
};

interface RetiringPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RetiringPage({
  searchParams,
}: RetiringPageProps) {
  const raw = await searchParams;
  const page = Math.max(1, parseInt(String(raw.page ?? "1"), 10) || 1);

  const result = await fetchRetiringSets(page);

  return (
    <div className="py-8">
      <PageContainer className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Retiring Sets</h1>
          <p className="text-muted-foreground mt-1">
            Retired LEGO sets ordered by year. Retired sets often appreciate in
            value.
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
            No retired sets found.
          </p>
        )}

        <MarketPagination
          currentPage={result.page}
          totalPages={result.totalPages}
          totalCount={result.totalCount}
          pageSize={result.pageSize}
          basePath="/market/retiring"
        />
      </PageContainer>
    </div>
  );
}
