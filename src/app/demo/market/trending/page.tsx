import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TrendingTable } from "@/components/market-v2/trending-table";

export const metadata: Metadata = {
  title: "Trending Sets demo · BrickX",
  robots: { index: false, follow: false },
};

export default function TrendingPage() {
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
          Trending · demo
        </div>
        <h1 className="mt-2 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[56px]">
          Who&rsquo;s moving.
        </h1>
        <p className="mt-3 max-w-xl text-small text-text-secondary leading-relaxed">
          Sets with the largest price movements over the selected period. Volume-weighted, updated nightly.
        </p>
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 sm:px-10 lg:px-14">
        <TrendingTable defaultPeriod="30d" showLosers />
      </div>
    </main>
  );
}
