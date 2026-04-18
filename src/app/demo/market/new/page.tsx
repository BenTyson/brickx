import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { newReleases } from "@/lib/mock/indices";
import { NewReleaseCard } from "@/components/market-v2/new-release-card";
import { StaggerChildren } from "@/components/motion";

export const metadata: Metadata = {
  title: "New Releases demo · BrickX",
  robots: { index: false, follow: false },
};

export default function NewReleasesPage() {
  const entries = newReleases();

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
          New Releases · demo
        </div>
        <h1 className="mt-2 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[56px]">
          Fresh plastic. Early signal.
        </h1>
        <p className="mt-3 max-w-xl text-small text-text-secondary leading-relaxed">
          Sets in their first 90 days on the secondary market. The early price trajectory is the best signal we have — watch for sets trading above MSRP before sell-through pressure normalises.
        </p>
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 sm:px-10 lg:px-14">
        {/* Stats strip */}
        <div className="flex flex-wrap gap-6 rounded-2xl border border-border-thin bg-bg-raised px-5 py-4 sm:px-6">
          <StatPill label="Sets tracked this quarter" value={String(entries.length * 4)} />
          <StatPill
            label="Avg first-30d vs MSRP"
            value={`${entries.reduce((s, e) => s + e.priceVsMsrp, 0) > 0 ? "+" : ""}${(entries.reduce((s, e) => s + e.priceVsMsrp, 0) / entries.length).toFixed(1)}%`}
          />
          <StatPill
            label="Trading above MSRP"
            value={`${entries.filter((e) => e.priceVsMsrp >= 0).length} / ${entries.length}`}
          />
        </div>

        {/* Cards grid */}
        <StaggerChildren
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          stagger={0.04}
        >
          {entries.map((entry) => (
            <NewReleaseCard key={entry.set.id} entry={entry} />
          ))}
        </StaggerChildren>
      </div>
    </main>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-micro font-mono font-tabular text-text-tertiary">{label}</div>
      <div className="mt-1 font-mono font-tabular tabular-nums text-text-primary">{value}</div>
    </div>
  );
}
