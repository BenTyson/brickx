import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { DeltaChip } from "@/components/ui/delta-chip";
import { Sparkline } from "@/components/charts/sparkline";
import { sparklineForSet } from "@/lib/mock/catalog";
import type { CatalogSet } from "@/lib/mock/catalog";

interface ConstituentRow extends CatalogSet {
  weight: number;
  indexDelta1y: number;
}

interface IndexConstituentsProps {
  rows: ConstituentRow[];
  className?: string;
}

export function IndexConstituents({ rows, className }: IndexConstituentsProps) {
  return (
    <section className={cn("rounded-2xl border border-border-thin bg-bg-raised", className)}>
      <div className="border-b border-border-thin px-5 py-4 sm:px-6">
        <div className="text-micro font-mono font-tabular text-text-tertiary">Constituents</div>
        <div className="mt-1 font-serif-display text-[20px] leading-tight text-text-primary">
          {rows.length} sets in this index.
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[minmax(0,1fr)_4.5rem_4rem_5rem_4.5rem_4.5rem] items-center gap-2 border-b border-border-thin bg-bg-overlay px-5 py-1.5 text-micro font-mono font-tabular text-text-quaternary sm:px-6">
        <span>Set</span>
        <span className="text-right">Price</span>
        <span className="text-right">Weight</span>
        <span className="hidden text-right sm:block">30d chart</span>
        <span className="text-right">30d</span>
        <span className="text-right">All-time</span>
      </div>

      <ul className="divide-y divide-[var(--border-thin)]">
        {rows.map((row) => {
          const sparkline = sparklineForSet(row, 30);
          return (
            <li key={row.id}>
              <Link
                href={`/demo/sets/${row.id}`}
                className="group grid grid-cols-[minmax(0,1fr)_4.5rem_4rem_5rem_4.5rem_4.5rem] items-center gap-2 px-5 py-3 transition hover:bg-bg-overlay sm:px-6"
              >
                <div className="min-w-0">
                  <div className="truncate text-small font-medium text-text-primary transition group-hover:text-accent-hover">
                    {row.name}
                  </div>
                  <div className="text-micro font-mono font-tabular text-text-tertiary">
                    #{row.id} · {row.theme}
                  </div>
                </div>
                <span className="text-right font-mono font-tabular text-small tabular-nums text-text-primary">
                  ${row.currentValue.toLocaleString()}
                </span>
                <span className="text-right font-mono font-tabular text-micro tabular-nums text-text-tertiary">
                  {row.weight.toFixed(1)}%
                </span>
                <span className="hidden justify-end sm:flex">
                  <Sparkline
                    data={sparkline}
                    width={64}
                    height={20}
                    tone="auto"
                    showEndDot={false}
                  />
                </span>
                <span className="flex justify-end">
                  <DeltaChip value={row.pctChange30d} size="sm" hideIcon />
                </span>
                <span className="text-right font-mono font-tabular text-micro tabular-nums text-success">
                  +{row.appreciation.toFixed(1)}%
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
