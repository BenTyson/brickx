import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SetDetailBreadcrumb } from "@/components/set-detail-v2/set-detail-breadcrumb";
import { SetImageGallery } from "@/components/set-detail-v2/set-image-gallery";
import { SetInfoHeader } from "@/components/set-detail-v2/set-info-header";
import { KeyStatsStrip } from "@/components/set-detail-v2/key-stats-strip";
import { PriceHistoryChart } from "@/components/set-detail-v2/price-history-chart";
import { FundamentalsGrid } from "@/components/set-detail-v2/fundamentals-grid";
import { MethodologyDisclosure } from "@/components/set-detail-v2/methodology-disclosure";
import { RelatedCarousel } from "@/components/set-detail-v2/related-carousel";
import { CorrelatedGrid } from "@/components/set-detail-v2/correlated-grid";
import { StickyActionsRail } from "@/components/set-detail-v2/sticky-actions-rail";
import {
  getMockSetDetail,
  listMockDetailIds,
} from "@/lib/mock/set-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = getMockSetDetail(id);
  if (!data) return { title: "Set demo · BrickX", robots: { index: false } };
  return {
    title: `${data.set.name} (${data.set.id}) · BrickX demo`,
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return listMockDetailIds().map((id) => ({ id }));
}

export default async function SetDetailDemoPage({ params }: PageProps) {
  const { id } = await params;
  const data = getMockSetDetail(id);
  if (!data) notFound();

  const marketValue = data.priceSeries[data.priceSeries.length - 1].v;

  return (
    <main className="bg-bg-base pb-32 lg:pb-16">
      <div className="mx-auto max-w-[1320px] px-6 pb-10 pt-8 sm:px-10 lg:px-14">
        <SetDetailBreadcrumb
          themeName={data.set.theme}
          themeSlug={data.set.themeSlug}
          setName={data.set.name}
        />
      </div>

      <div className="mx-auto grid max-w-[1320px] gap-10 px-6 sm:px-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-14">
        <div className="space-y-12">
          {/* Hero */}
          <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <SetImageGallery images={data.images} setName={data.set.name} />
            <SetInfoHeader
              set={data.set}
              marketValue={marketValue}
              delta30d={data.delta30d}
              delta1y={data.delta1y}
              bid={data.bid}
              ask={data.ask}
              indices={data.indices}
            />
          </section>

          <KeyStatsStrip stats={data.keyStats} />

          <PriceHistoryChart
            series={data.priceSeries}
            usedSeries={data.usedSeries}
            sources={data.sources}
            events={data.events}
          />

          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <FundamentalsGrid fundamentals={data.fundamentals} />
            <MethodologyDisclosure />
          </div>

          <RelatedCarousel
            themeName={data.set.theme}
            themeSlug={data.set.themeSlug}
            sets={data.related}
          />

          <CorrelatedGrid sets={data.correlated} />

          <footer className="border-t border-border-thin pt-6 text-micro font-mono font-tabular tracking-[0.06em] text-text-quaternary">
            Demo workbench · all figures are mocked, deterministic per set ID.
          </footer>
        </div>

        <StickyActionsRail
          setId={data.set.id}
          setName={data.set.name}
          marketValue={marketValue}
          delta30d={data.delta30d}
        />
      </div>
    </main>
  );
}
