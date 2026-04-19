import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { FadeIn, StaggerChildren } from "@/components/motion";
import { ThemeCard } from "@/components/catalog/theme-card";
import { fetchThemes } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Themes | BrickX",
  description:
    "Browse LEGO sets by theme. Star Wars, Modulars, Creator Expert, Technic, and more — each with aggregated appreciation and set counts.",
};

export default async function ThemesPage() {
  const themes = await fetchThemes();

  const pinned = themes.slice(0, 4);
  const rest = themes.slice(4);

  return (
    <main className="mx-auto max-w-[1320px] px-6 pb-24 pt-10 sm:px-10 lg:px-14">
      <FadeIn>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-micro font-mono font-tabular text-text-tertiary">
              Browse · Themes
            </div>
            <h1 className="mt-5 max-w-[720px] text-h1 font-serif-display text-text-primary">
              Think in themes, not one-offs.
            </h1>
            <p className="mt-5 max-w-[560px] text-body text-text-secondary">
              Every theme has its own constituents and appreciation curve. The
              top themes by coverage are pinned; the rest are where you find
              the asymmetric bets.
            </p>
          </div>
          <Link
            href="/sets"
            className="hidden shrink-0 items-center gap-1 text-small text-text-tertiary transition hover:text-text-primary md:inline-flex"
          >
            Browse all sets
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </FadeIn>

      {pinned.length > 0 && (
        <section className="mt-14" aria-labelledby="pinned-heading">
          <div className="mb-6 flex items-center gap-3">
            <h2
              id="pinned-heading"
              className="text-micro font-mono font-tabular uppercase tracking-[0.1em] text-text-tertiary"
            >
              Top themes
            </h2>
            <span className="h-px flex-1 bg-border-thin" />
            <span className="text-micro font-mono font-tabular text-text-quaternary">
              by set count
            </span>
          </div>
          <StaggerChildren
            className="grid gap-5 md:grid-cols-2"
            stagger={0.06}
          >
            {pinned.map((t) => (
              <ThemeCard
                key={t.id}
                theme={t}
                emphasis
                href={`/themes/${t.slug}`}
              />
            ))}
          </StaggerChildren>
        </section>
      )}

      {rest.length > 0 && (
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
              {themes.length.toLocaleString()} tracked
            </span>
          </div>
          <StaggerChildren
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.04}
          >
            {rest.map((t) => (
              <ThemeCard key={t.id} theme={t} href={`/themes/${t.slug}`} />
            ))}
          </StaggerChildren>
        </section>
      )}
    </main>
  );
}
