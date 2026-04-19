import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { FadeIn } from "@/components/motion";
import { DeltaChip } from "@/components/ui/delta-chip";
import { CatalogListView } from "@/components/catalog/catalog-list-view";
import { fetchThemeDetail } from "@/lib/queries";
import { toCatalogSetView } from "@/lib/view-models/catalog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const theme = await fetchThemeDetail(slug);
  if (!theme) return { title: "Theme Not Found | BrickX" };
  return {
    title: `${theme.name} | BrickX`,
    description: `Every LEGO ${theme.name} set tracked by BrickX. ${theme.setCount.toLocaleString()} constituents with market values and appreciation data.`,
  };
}

export default async function ThemeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const theme = await fetchThemeDetail(slug);
  if (!theme) notFound();

  const views = theme.sets.map(toCatalogSetView);
  const avgAppreciation = theme.avgAppreciation ?? 0;

  const topMovers = [...views]
    .sort((a, b) => b.pctChange30d - a.pctChange30d)
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-[1320px] px-6 pb-24 pt-10 sm:px-10 lg:px-14">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-micro font-mono font-tabular uppercase tracking-[0.06em] text-text-tertiary"
      >
        <Link href="/themes" className="transition hover:text-text-primary">
          Themes
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-text-secondary">{theme.name}</span>
      </nav>

      <FadeIn className="mt-8">
        <div className="text-micro font-mono font-tabular text-text-tertiary">
          Theme · {theme.setCount.toLocaleString()} constituents
        </div>
        <h1 className="mt-5 max-w-[820px] text-h1 font-serif-display italic text-text-primary">
          {theme.name}
        </h1>
        {theme.avgAppreciation != null && (
          <div className="mt-8 flex flex-wrap items-end gap-6">
            <div className="flex items-baseline gap-4">
              <span className="font-mono font-tabular tabular-nums text-text-primary text-5xl tracking-tight lg:text-[64px]">
                {avgAppreciation >= 0 ? "+" : ""}
                {avgAppreciation.toFixed(1)}%
              </span>
              <DeltaChip value={avgAppreciation} />
            </div>
            <div className="text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
              Avg annual appreciation · across theme
            </div>
          </div>
        )}
      </FadeIn>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Sets tracked"
          value={theme.setCount.toLocaleString()}
        />
        <StatTile
          label="Retired"
          value={theme.retiredCount.toLocaleString()}
          hint={`${Math.round((theme.retiredCount / Math.max(theme.setCount, 1)) * 100)}%`}
        />
        <StatTile
          label="Avg market value"
          value={
            theme.avgValue != null
              ? `$${Math.round(theme.avgValue).toLocaleString()}`
              : "—"
          }
        />
        <StatTile
          label="Top constituent return"
          value={
            theme.topReturn != null
              ? `${theme.topReturn >= 0 ? "+" : ""}${theme.topReturn.toFixed(1)}%`
              : "—"
          }
          hint="annualized"
        />
      </section>

      <section className="mt-16" aria-labelledby="constituents-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2
              id="constituents-heading"
              className="text-h3 font-serif-display italic text-text-primary"
            >
              Constituents
            </h2>
            <p className="mt-1 text-small text-text-secondary">
              Every set in this theme, sortable by market value, appreciation,
              or 30-day change.
            </p>
          </div>
          <Link
            href={`/sets?theme=${theme.id}`}
            className="text-small text-text-tertiary transition hover:text-text-primary"
          >
            Open in catalog →
          </Link>
        </div>
        {views.length > 0 ? (
          <CatalogListView sets={views} />
        ) : (
          <div className="rounded-2xl border border-border-thin bg-card p-10 text-center text-small text-text-tertiary">
            No sets tracked in this theme yet.
          </div>
        )}
      </section>

      {topMovers.length > 0 && (
        <section className="mt-16" aria-labelledby="movers-heading">
          <div className="mb-6 flex items-center gap-3">
            <h2
              id="movers-heading"
              className="text-micro font-mono font-tabular uppercase tracking-[0.1em] text-text-tertiary"
            >
              Top movers (30d)
            </h2>
            <span className="h-px flex-1 bg-border-thin" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topMovers.map((s) => (
              <Link
                key={s.id}
                href={`/sets/${s.id}`}
                className="rounded-xl border border-border-thin bg-card p-5 transition hover:border-border-emphasis"
              >
                <div className="text-micro font-mono font-tabular text-text-tertiary">
                  {s.id} · {s.year}
                </div>
                <div className="mt-2 line-clamp-2 text-small text-text-primary">
                  {s.name}
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-2">
                  <span className="font-mono font-tabular tabular-nums text-text-primary">
                    {s.currentValue > 0
                      ? `$${s.currentValue.toLocaleString()}`
                      : "—"}
                  </span>
                  <DeltaChip value={s.pctChange30d} size="sm" hideIcon />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border-thin bg-card p-5">
      <div className="text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
        {label}
      </div>
      <div className="mt-3 font-mono font-tabular tabular-nums text-3xl text-text-primary">
        {value}
      </div>
      {hint && (
        <div className="mt-1 text-[10px] font-mono font-tabular uppercase tracking-[0.06em] text-text-quaternary">
          {hint}
        </div>
      )}
    </div>
  );
}
