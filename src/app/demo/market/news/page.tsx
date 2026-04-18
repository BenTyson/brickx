import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { NEWS_FEED } from "@/lib/mock/indices";
import { NewsFeed } from "@/components/market-v2/news-feed";

export const metadata: Metadata = {
  title: "Market News demo · BrickX",
  robots: { index: false, follow: false },
};

export default function NewsPage() {
  return (
    <main className="bg-bg-base pb-24">
      <div className="mx-auto max-w-[1320px] px-6 pt-8 sm:px-10 lg:px-14">
        <Link
          href="/demo/market"
          className="inline-flex items-center gap-1 text-micro font-mono font-tabular text-text-tertiary transition hover:text-text-primary"
        >
          <ChevronLeft className="size-3" aria-hidden />
          Market hub
        </Link>
      </div>

      <div className="mx-auto max-w-[1320px] px-6 pb-6 pt-4 sm:px-10 lg:px-14">
        <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
          News feed · demo
        </div>
        <h1 className="mt-2 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[56px]">
          What&rsquo;s moving the market.
        </h1>
        <p className="mt-3 max-w-xl text-small text-text-secondary leading-relaxed">
          LEGO retirements, re-releases, announcements, and market data updates — aggregated from official LEGO, BrickLink, and community sources. Stub data for the demo; live feed wired in Phase C.
        </p>
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 sm:px-10 lg:px-14">
        {/* Filter row (visual stub — not wired in demo) */}
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Retirements", "Re-releases", "Announcements", "Market", "Data"].map((f) => (
            <button
              key={f}
              type="button"
              className="rounded-full border border-border-thin bg-bg-raised px-3 py-1.5 text-micro font-mono font-tabular text-text-secondary transition hover:border-border-emphasis hover:text-text-primary first:border-accent first:bg-accent/10 first:text-accent"
            >
              {f}
            </button>
          ))}
        </div>

        <NewsFeed items={NEWS_FEED} />

        {/* Stub note */}
        <div className="rounded-xl border border-border-thin bg-bg-raised px-5 py-4 text-small text-text-tertiary">
          Live news ingestion (LEGO press releases, BrickLink retirement announcements, community signals) is a Phase C feature. The feed above is curated placeholder content representing the intended format.
        </div>
      </div>
    </main>
  );
}
