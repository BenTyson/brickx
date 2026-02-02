import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Package, Puzzle, Users } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { StatusBadge } from "@/components/status-badge";
import { Separator } from "@/components/ui/separator";
import { SetDetailBreadcrumb } from "@/components/detail/set-detail-breadcrumb";
import { MarketStatsGrid } from "@/components/detail/market-stats-grid";
import { PriceChart } from "@/components/detail/price-chart";
import { RelatedSets } from "@/components/detail/related-sets";
import { AddToCollectionButton } from "@/components/detail/add-to-collection-button";
import {
  fetchSetDetail,
  fetchPriceHistory,
  fetchRelatedSets,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

interface SetDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: SetDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const set = await fetchSetDetail(id);

  if (!set) {
    return { title: "Set Not Found | BrickX" };
  }

  return {
    title: `${set.name} (${set.id}) | BrickX`,
    description: `View market data, price history, and investment insights for LEGO ${set.name} (${set.id}). ${set.theme_name ? `Theme: ${set.theme_name}.` : ""} Year: ${set.year}.`,
  };
}

export default async function SetDetailPage({ params }: SetDetailPageProps) {
  const { id } = await params;
  const set = await fetchSetDetail(id);

  if (!set) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [priceHistory, relatedSets] = await Promise.all([
    fetchPriceHistory(id),
    set.theme_id ? fetchRelatedSets(set.theme_id, id) : Promise.resolve([]),
  ]);

  return (
    <div className="py-8">
      <PageContainer className="space-y-8">
        {/* Breadcrumb */}
        <SetDetailBreadcrumb setName={set.name} />

        {/* Hero: Image + Info */}
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* Image */}
          <div className="flex items-start justify-center">
            {set.img_url ? (
              <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-xl">
                <Image
                  src={set.img_url}
                  alt={set.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="bg-muted flex aspect-square w-full max-w-[400px] items-center justify-center rounded-xl">
                <Package className="text-muted-foreground/50 size-24" />
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <StatusBadge status={set.status} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                {set.name}
              </h1>
              <p className="text-muted-foreground mt-1 text-lg">Set {set.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {set.theme_name && (
                <div>
                  <p className="text-muted-foreground text-sm">Theme</p>
                  <p className="font-medium">{set.theme_name}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-sm">Year</p>
                <p className="font-medium">{set.year}</p>
              </div>
              {set.msrp_usd != null && (
                <div>
                  <p className="text-muted-foreground text-sm">MSRP</p>
                  <p className="font-medium">${set.msrp_usd.toFixed(2)}</p>
                </div>
              )}
              {set.num_parts != null && (
                <div className="flex items-center gap-2">
                  <Puzzle
                    className="text-muted-foreground size-4"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-muted-foreground text-sm">Parts</p>
                    <p className="font-medium">
                      {set.num_parts.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {set.num_minifigs != null && (
                <div className="flex items-center gap-2">
                  <Users
                    className="text-muted-foreground size-4"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-muted-foreground text-sm">Minifigs</p>
                    <p className="font-medium">{set.num_minifigs}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Market value highlight */}
            {set.market_value_new != null && (
              <div className="bg-card rounded-lg border p-4">
                <p className="text-muted-foreground text-sm">
                  Current Market Value (New)
                </p>
                <p className="text-3xl font-bold tracking-tight">
                  ${set.market_value_new.toFixed(2)}
                </p>
                {set.msrp_usd != null && set.msrp_usd > 0 && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {(
                      ((set.market_value_new - set.msrp_usd) / set.msrp_usd) *
                      100
                    ).toFixed(1)}
                    % vs MSRP
                  </p>
                )}
              </div>
            )}

            <AddToCollectionButton
              setId={set.id}
              setName={set.name}
              userId={user?.id ?? null}
            />
          </div>
        </div>

        {/* Market Stats */}
        <Separator />
        <div>
          <h2 className="mb-4 text-2xl font-bold tracking-tight">
            Market Statistics
          </h2>
          <MarketStatsGrid set={set} />
        </div>

        {/* Price Chart */}
        <Separator />
        <PriceChart data={priceHistory} />

        {/* Related Sets */}
        {relatedSets.length > 0 && (
          <>
            <Separator />
            <RelatedSets sets={relatedSets} />
          </>
        )}
      </PageContainer>
    </div>
  );
}
