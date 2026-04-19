import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SetDetailBreadcrumb } from "@/components/detail/set-detail-breadcrumb";
import { SetImageGallery } from "@/components/detail/set-image-gallery";
import { SetInfoHeader } from "@/components/detail/set-info-header";
import { KeyStatsStrip } from "@/components/detail/key-stats-strip";
import { PriceHistoryChart } from "@/components/detail/price-history-chart";
import { FundamentalsGrid } from "@/components/detail/fundamentals-grid";
import { MethodologyDisclosure } from "@/components/detail/methodology-disclosure";
import { RelatedCarousel } from "@/components/detail/related-carousel";
import { StickyActionsRail } from "@/components/detail/sticky-actions-rail";
import { JsonLd } from "@/components/json-ld";
import {
  fetchSetDetail,
  fetchPriceHistory,
  fetchRelatedSets,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { toCatalogSetView } from "@/lib/view-models/catalog";
import { slugify } from "@/lib/utils/slug";
import type { PriceHistoryPoint } from "@/lib/types/catalog";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brickx.io";

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
  if (!set) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [priceHistory, relatedSets] = await Promise.all([
    fetchPriceHistory(id),
    set.theme_id ? fetchRelatedSets(set.theme_id, id) : Promise.resolve([]),
  ]);

  const marketValue = set.market_value_new ?? set.msrp_usd ?? 0;
  const delta30d = set.pct_change_30d ?? 0;
  const delta1y = set.growth_annual_pct;
  const msrp = set.msrp_usd ?? 0;
  const themeSlug = set.theme_name ? slugify(set.theme_name) : null;

  const images = [{ url: set.img_url, alt: set.name }];

  const keyStats = buildKeyStats(set.market_value_new, priceHistory, set.pct_change_90d, set.investment_score);
  const fundamentals = buildFundamentals(set);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: set.name,
    description: `LEGO ${set.name} (${set.id}). ${set.theme_name ? `Theme: ${set.theme_name}.` : ""} Year: ${set.year}. ${set.num_parts ? `${set.num_parts} parts.` : ""}`,
    sku: set.id,
    brand: { "@type": "Brand", name: "LEGO" },
    ...(set.img_url && { image: set.img_url }),
    url: `${BASE_URL}/sets/${set.id}`,
    ...(set.market_value_new != null && {
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: set.market_value_new,
        highPrice: set.market_value_new,
        availability: "https://schema.org/InStock",
      },
    }),
  };

  return (
    <main className="bg-bg-base pb-32 lg:pb-16">
      <JsonLd data={productJsonLd} />
      <div className="mx-auto max-w-[1320px] px-6 pb-10 pt-8 sm:px-10 lg:px-14">
        <SetDetailBreadcrumb
          themeName={set.theme_name}
          themeSlug={themeSlug}
          setName={set.name}
        />
      </div>

      <div className="mx-auto grid max-w-[1320px] gap-10 px-6 sm:px-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-14">
        <div className="space-y-12">
          <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <SetImageGallery images={images} setName={set.name} />
            <SetInfoHeader
              setId={set.id}
              name={set.name}
              theme={set.theme_name ?? "Unknown"}
              year={set.year}
              status={set.status}
              marketValue={marketValue}
              msrp={msrp}
              delta30d={delta30d}
              delta1y={delta1y}
            />
          </section>

          <KeyStatsStrip stats={keyStats} />

          <PriceHistoryChart priceHistory={priceHistory} />

          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <FundamentalsGrid fundamentals={fundamentals} />
            <MethodologyDisclosure />
          </div>

          {relatedSets.length > 0 && set.theme_name && themeSlug && (
            <RelatedCarousel
              themeName={set.theme_name}
              themeSlug={themeSlug}
              sets={relatedSets.map(toCatalogSetView)}
            />
          )}
        </div>

        <StickyActionsRail
          setId={set.id}
          setName={set.name}
          marketValue={marketValue}
          delta30d={delta30d}
          userId={user?.id ?? null}
        />
      </div>
    </main>
  );
}

function buildKeyStats(
  marketValueNew: number | null,
  priceHistory: PriceHistoryPoint[],
  pctChange90d: number | null,
  investmentScore: number | null,
) {
  // 30d high/low from any source with new_avg data
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = priceHistory.filter(
    (p) => new Date(p.date).getTime() >= cutoff && p.new_avg != null,
  );
  let high30d: number | null = null;
  let low30d: number | null = null;
  if (recent.length > 0) {
    const vals = recent.map((p) => p.new_avg as number);
    high30d = Math.max(...vals);
    low30d = Math.min(...vals);
  }
  return {
    lastSale: marketValueNew,
    high30d,
    low30d,
    pctChange90d,
    investmentScore,
  };
}

function buildFundamentals(set: {
  msrp_usd: number | null;
  num_parts: number | null;
  num_minifigs: number | null;
  market_value_new: number | null;
  year: number;
  status: "available" | "retired" | "unreleased";
}) {
  const msrp = set.msrp_usd ?? 0;
  const parts = set.num_parts ?? 0;
  const minifigs = set.num_minifigs ?? 0;
  const current = set.market_value_new ?? msrp;
  const today = new Date();
  const yearsSince = Math.max(today.getFullYear() - set.year, 0.1);
  const cagr =
    msrp > 0 && current > 0
      ? (Math.pow(current / msrp, 1 / yearsSince) - 1) * 100
      : null;
  return {
    msrp,
    parts,
    minifigs,
    pricePerPart: parts > 0 ? current / parts : 0,
    msrpPerPart: parts > 0 ? msrp / parts : 0,
    cagr,
    yearsSinceRelease: yearsSince,
    projectedRetirement:
      set.status === "available" ? `${set.year + 4}` : null,
  };
}
