import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { fetchPortfolioSummary } from "@/lib/queries";
import { PortfolioSummaryCards } from "@/components/portfolio/portfolio-summary-cards";
import { CollectionsBreakdownTable } from "@/components/portfolio/collections-breakdown-table";

export const metadata: Metadata = {
  title: "Portfolio | BrickX",
  description:
    "View your LEGO portfolio summary, total value, and collection breakdown.",
};

export default async function PortfolioPage() {
  const summary = await fetchPortfolioSummary();

  if (summary.total_sets === 0) {
    return (
      <PageContainer className="py-8">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <BarChart3 className="text-muted-foreground/50 mb-4 size-12" />
          <h2 className="text-lg font-semibold">Your portfolio is empty</h2>
          <p className="text-muted-foreground mt-1 max-w-sm text-sm">
            Add LEGO sets to your collections to see portfolio analytics and
            track your investment performance.
          </p>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/collections">My Collections</Link>
            </Button>
            <Button asChild>
              <Link href="/sets">Browse Sets</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        <p className="text-muted-foreground mt-1">
          Track the performance of your LEGO investments
        </p>
      </div>

      <PortfolioSummaryCards summary={summary} />
      <CollectionsBreakdownTable collections={summary.collections} />
    </PageContainer>
  );
}
