import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { ThemeCard } from "@/components/catalog-v2/theme-card";
import { CATALOG_THEMES } from "@/lib/mock/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Themes — BrickX Demo",
  robots: { index: false, follow: false },
};

export default function ThemesHubPage() {
  const pinned = CATALOG_THEMES.filter((t) => t.pinned);
  const rest = CATALOG_THEMES.filter((t) => !t.pinned);

  return (
    <main className="mx-auto max-w-[1320px] px-6 pb-24 pt-10 sm:px-10 lg:px-14">
      <FadeIn>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-micro font-mono font-tabular text-text-tertiary">
              D4 · Themes
            </div>
            <h1 className="mt-5 max-w-[720px] text-h1 font-serif-display text-text-primary">
              Think in themes, not one-offs.
            </h1>
            <p className="mt-5 max-w-[560px] text-body text-text-secondary">
              Every theme has its own index, constituents, and appreciation
              curve. Pinned themes move the market — the rest are where you
              find the asymmetric bets.
            </p>
          </div>
          <Link
            href="/demo/sets"
            className="hidden shrink-0 items-center gap-1 text-small text-text-tertiary transition hover:text-text-primary md:inline-flex"
          >
            Browse all sets
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </FadeIn>

      <section className="mt-14" aria-labelledby="pinned-heading">
        <div className="mb-6 flex items-center gap-3">
          <h2
            id="pinned-heading"
            className="text-micro font-mono font-tabular uppercase tracking-[0.1em] text-text-tertiary"
          >
            Pinned
          </h2>
          <span className="h-px flex-1 bg-border-thin" />
          <span className="text-micro font-mono font-tabular text-text-quaternary">
            {pinned.length} blue-chip themes
          </span>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {pinned.map((t) => (
            <ThemeCard
              key={t.slug}
              theme={t}
              emphasis
              href={`/demo/themes/${t.slug}`}
            />
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="all-heading">
        <div className="mb-6 flex items-center gap-3">
          <h2
            id="all-heading"
            className="text-micro font-mono font-tabular uppercase tracking-[0.1em] text-text-tertiary"
          >
            All themes
          </h2>
          <span className="h-px flex-1 bg-border-thin" />
          <span className="text-micro font-mono font-tabular text-text-quaternary">
            {CATALOG_THEMES.length} tracked
          </span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((t) => (
            <ThemeCard
              key={t.slug}
              theme={t}
              href={`/demo/themes/${t.slug}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
