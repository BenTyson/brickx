import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { INDICES, indexConstituents } from "@/lib/mock/indices";
import { IndexHero } from "@/components/market-v2/index-hero";
import { IndexConstituents } from "@/components/market-v2/index-constituents";

export function generateStaticParams() {
  return INDICES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const index = INDICES.find((i) => i.slug === slug);
  return {
    title: index ? `${index.name} demo · BrickX` : "Index · BrickX",
    robots: { index: false, follow: false },
  };
}

export default async function IndexDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = INDICES.find((i) => i.slug === slug);
  if (!index) notFound();

  const constituents = indexConstituents(slug);

  return (
    <main className="bg-bg-base pb-24">
      {/* Back nav */}
      <div className="mx-auto max-w-[1320px] px-6 pt-8 sm:px-10 lg:px-14">
        <Link
          href="/demo/market"
          className="inline-flex items-center gap-1 text-micro font-mono font-tabular text-text-tertiary transition hover:text-text-primary"
        >
          <ChevronLeft className="size-3" aria-hidden />
          Market hub
        </Link>
      </div>

      {/* Page header */}
      <div className="mx-auto max-w-[1320px] px-6 pb-6 pt-4 sm:px-10 lg:px-14">
        <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
          Index · demo
        </div>
        <h1 className="mt-2 font-serif-display text-[40px] leading-[1.02] tracking-tight text-text-primary sm:text-[52px]">
          {index.name}
        </h1>
        <p className="mt-3 max-w-2xl text-small text-text-secondary leading-relaxed">
          {index.description}
        </p>
      </div>

      {/* Content */}
      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 sm:px-10 lg:px-14">
        {/* Hero chart */}
        <IndexHero index={index} />

        {/* Methodology + rebalance */}
        <div className="grid gap-6 lg:grid-cols-2">
          <details className="group rounded-2xl border border-border-thin bg-bg-raised">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 sm:px-6">
              <div>
                <div className="text-micro font-mono font-tabular text-text-tertiary">
                  Methodology
                </div>
                <div className="mt-0.5 text-small font-medium text-text-primary">
                  How this index is built
                </div>
              </div>
              <ChevronDown
                className="size-4 text-text-tertiary transition group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="border-t border-border-thin px-5 py-4 text-small text-text-secondary leading-relaxed sm:px-6">
              {index.methodology}
            </div>
          </details>

          <details className="group rounded-2xl border border-border-thin bg-bg-raised">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 sm:px-6">
              <div>
                <div className="text-micro font-mono font-tabular text-text-tertiary">
                  Rebalance notes
                </div>
                <div className="mt-0.5 text-small font-medium text-text-primary">
                  Latest changes
                </div>
              </div>
              <ChevronDown
                className="size-4 text-text-tertiary transition group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="border-t border-border-thin px-5 py-4 text-small text-text-secondary leading-relaxed sm:px-6">
              {index.rebalanceNotes}
            </div>
          </details>
        </div>

        {/* Constituents table */}
        <IndexConstituents rows={constituents} />

        {/* Other indices */}
        <div className="border-t border-border-thin pt-6">
          <div className="mb-3 text-micro font-mono font-tabular text-text-tertiary">
            Other indices
          </div>
          <div className="flex flex-wrap gap-2">
            {INDICES.filter((i) => i.slug !== slug).map((idx) => (
              <Link
                key={idx.slug}
                href={`/demo/market/indices/${idx.slug}`}
                className="rounded-full border border-border-thin bg-bg-raised px-3 py-1.5 text-micro font-mono font-tabular text-text-secondary transition hover:border-border-emphasis hover:text-text-primary"
              >
                {idx.shortName} — {idx.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
