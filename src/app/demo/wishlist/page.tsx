import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WISHLIST } from "@/lib/mock/portfolio";
import { WishlistGrid } from "@/components/portfolio-v2/wishlist-grid";

export const metadata: Metadata = {
  title: "Wishlist demo · BrickX",
  robots: { index: false, follow: false },
};

export default function WishlistDemoPage() {
  const dealsFirst = [...WISHLIST].sort(
    (a, b) => Number(b.dealDetected) - Number(a.dealDetected),
  );

  return (
    <main className="bg-bg-base pb-24">
      <div className="mx-auto max-w-[1320px] px-6 pb-6 pt-10 sm:px-10 lg:px-14">
        <Link
          href="/demo/portfolio"
          className="inline-flex items-center gap-1 text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary transition hover:text-text-primary"
        >
          <ArrowLeft className="size-3" aria-hidden />
          Back to portfolio
        </Link>
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
              Wishlist · demo
            </div>
            <h1 className="mt-2 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[52px]">
              The watchlist, patiently waiting.
            </h1>
            <p className="mt-3 max-w-xl text-body text-text-secondary">
              Target prices, current market, and a deal flag when things come
              within striking distance.
            </p>
          </div>
          <div className="text-micro font-mono font-tabular tabular-nums text-text-quaternary">
            {WISHLIST.filter((w) => w.dealDetected).length} deals detected ·{" "}
            {WISHLIST.length} total
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-14">
        <WishlistGrid items={dealsFirst} />
      </div>
    </main>
  );
}
