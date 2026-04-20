import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Sparkline } from "@/components/charts/sparkline";
import { DeltaChip } from "@/components/ui/delta-chip";
import type { SeriesPoint } from "@/lib/mock/series";
import {
  COLLECTIONS,
  HOLDINGS,
  holdingHistorySeries,
  themeColor,
  type Collection,
  type Holding,
} from "@/lib/mock/portfolio";

export interface CollectionsStripRow {
  id: string;
  name: string;
  setCount: number;
  itemCount: number;
  value: number;
  delta30d: number;
  gainPct: number;
  series: SeriesPoint[];
  tintColor: string;
}

interface CollectionsStripProps {
  className?: string;
  hrefPrefix?: string;
  /** When provided, replaces the mock-generated cards. */
  rows?: CollectionsStripRow[];
}

export function CollectionsStrip({
  className,
  hrefPrefix = "/demo/collections",
  rows: rowsProp,
}: CollectionsStripProps) {
  const rows = rowsProp ?? COLLECTIONS.map((c) => buildCollectionCard(c, HOLDINGS));

  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            Collections
          </div>
          <div className="mt-1 font-serif-display text-[22px] leading-tight text-text-primary">
            Your shelves, one click away.
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((r) => (
          <Link
            key={r.id}
            href={`${hrefPrefix}/${r.id}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border-thin bg-bg-raised p-4 transition hover:-translate-y-[1px] hover:border-border-emphasis"
          >
            <div className="flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                aria-hidden
                style={{ backgroundColor: r.tintColor }}
              />
              <span className="flex-1 truncate text-small text-text-primary">
                {r.name}
              </span>
              <ArrowRight
                className="size-3.5 text-text-quaternary transition-transform group-hover:translate-x-0.5 group-hover:text-text-secondary"
                aria-hidden
              />
            </div>
            <div className="mt-3 font-mono font-tabular text-xl tabular-nums text-text-primary">
              ${Math.round(r.value).toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-2 text-micro font-mono font-tabular tabular-nums text-text-tertiary">
              <span>{r.setCount} sets</span>
              <span>·</span>
              <span>{r.itemCount} items</span>
            </div>
            <div className="mt-3">
              <Sparkline
                data={r.series}
                width={240}
                height={30}
                className="w-full"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <DeltaChip value={r.delta30d} size="sm" suffix="30d" />
              <DeltaChip value={r.gainPct} size="sm" hideIcon suffix="all" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function buildCollectionCard(c: Collection, holdings: Holding[]) {
  const inColl = holdings.filter((h) => h.collectionId === c.id);
  let value = 0;
  let cost = 0;
  let items = 0;
  let monthDollars = 0;
  for (const h of inColl) {
    const mkt = h.set.currentValue * h.qty;
    value += mkt;
    cost += h.costBasisPerUnit * h.qty;
    items += h.qty;
    monthDollars += (h.set.pctChange30d / 100) * mkt;
  }
  const delta30d = value > 0 ? (monthDollars / value) * 100 : 0;
  const gainPct = cost > 0 ? ((value - cost) / cost) * 100 : 0;
  // Build aggregated series by summing one representative holding's history.
  const topHolding = inColl.sort(
    (a, b) => b.set.currentValue * b.qty - a.set.currentValue * a.qty,
  )[0];
  const series = topHolding
    ? holdingHistorySeries(topHolding, 90).map((p) => ({ t: 0, v: p.v }))
    : [];
  return {
    id: c.id,
    name: c.name,
    setCount: inColl.length,
    itemCount: items,
    value,
    delta30d,
    gainPct,
    series,
    tintColor: themeColor(inColl[0]?.set.themeSlug ?? ""),
  };
}
