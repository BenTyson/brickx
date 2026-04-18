import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { retiringSoon } from "@/lib/mock/indices";
import { RetiringCard } from "@/components/market-v2/retiring-card";
import { StaggerChildren } from "@/components/motion";

export const metadata: Metadata = {
  title: "Retiring Soon demo · BrickX",
  robots: { index: false, follow: false },
};

export default function RetiringSoonPage() {
  const entries = retiringSoon();

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
          Retiring Soon · demo
        </div>
        <h1 className="mt-2 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[56px]">
          Buy before the shelf clears.
        </h1>
        <p className="mt-3 max-w-xl text-small text-text-secondary leading-relaxed">
          Sets approaching end-of-life. Historically, retired LEGO sets appreciate 20–50% in the 18 months after EOL. Countdown and risk scores are BrickX estimates — do your own research.
        </p>
      </div>

      <div className="mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-14">
        {/* Urgency disclaimer */}
        <div className="mb-6 rounded-xl border border-warning/20 bg-[color-mix(in_oklab,var(--warning)_6%,transparent)] px-4 py-3">
          <p className="text-small text-text-secondary">
            <span className="font-medium text-warning">Estimates only.</span> Countdown timers are based on LEGO&rsquo;s historical retirement patterns and community signals — not official LEGO announcements. Treat as directional, not definitive.
          </p>
        </div>

        <StaggerChildren
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          stagger={0.04}
        >
          {entries.map((entry) => (
            <RetiringCard key={entry.set.id} entry={entry} />
          ))}
        </StaggerChildren>

        {/* Methodology note */}
        <div className="mt-8 rounded-2xl border border-border-thin bg-bg-raised p-5 sm:p-6">
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            How we estimate retirement
          </div>
          <div className="mt-3 grid gap-4 text-small text-text-secondary leading-relaxed sm:grid-cols-3">
            <div>
              <div className="mb-1.5 font-medium text-text-primary">Countdown</div>
              Based on LEGO&rsquo;s typical 2–4 year product lifecycle, filtered by theme-specific patterns. Star Wars UCS sets: ~3 years. Modulars: ~4–5 years. Ideas: ~3 years.
            </div>
            <div>
              <div className="mb-1.5 font-medium text-text-primary">Retirement appreciation</div>
              Historical average appreciation for same-theme, similar-size sets at the 18-month post-retirement mark. Not a guarantee — individual sets vary widely.
            </div>
            <div>
              <div className="mb-1.5 font-medium text-text-primary">Risk score</div>
              Composite of: secondary-market volatility (30d std dev), theme demand stability, re-release probability, price vs MSRP premium. 0 = low risk, 100 = high.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
