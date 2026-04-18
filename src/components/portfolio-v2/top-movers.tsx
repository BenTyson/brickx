"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Sparkline } from "@/components/charts/sparkline";
import { DeltaChip } from "@/components/ui/delta-chip";
import type { MoverRow } from "@/lib/mock/portfolio";

interface TopMoversProps {
  gainers: MoverRow[];
  losers: MoverRow[];
  setHrefPrefix?: string;
  className?: string;
}

export function TopMovers({
  gainers,
  losers,
  setHrefPrefix = "/demo/sets",
  className,
}: TopMoversProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border-thin bg-bg-raised p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            Top movers · 30 days
          </div>
          <div className="mt-1 font-serif-display text-[22px] leading-tight text-text-primary">
            Who&rsquo;s earning their shelf space.
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <MoverColumn
          title="Gainers"
          tone="success"
          rows={gainers}
          hrefPrefix={setHrefPrefix}
        />
        <MoverColumn
          title="Losers"
          tone="danger"
          rows={losers}
          hrefPrefix={setHrefPrefix}
        />
      </div>
    </section>
  );
}

function MoverColumn({
  title,
  tone,
  rows,
  hrefPrefix,
}: {
  title: string;
  tone: "success" | "danger";
  rows: MoverRow[];
  hrefPrefix: string;
}) {
  return (
    <div>
      <div
        className={cn(
          "text-micro font-mono font-tabular tracking-[0.08em]",
          tone === "success" ? "text-success" : "text-danger",
        )}
      >
        {title}
      </div>
      <ul className="mt-2 flex flex-col divide-y divide-[var(--border-thin)]">
        {rows.length === 0 && (
          <li className="py-4 text-small text-text-tertiary">Nothing here yet.</li>
        )}
        {rows.map((r) => (
          <li key={r.holding.set.id} className="py-2.5">
            <div className="flex items-center gap-3">
              <Link
                href={`${hrefPrefix}/${r.holding.set.id}`}
                className="min-w-0 flex-1 truncate text-small text-text-primary transition hover:text-accent-hover"
              >
                {r.holding.set.name}
              </Link>
              <Sparkline
                data={r.holding.sparkline30d}
                width={70}
                height={20}
                tone={tone}
                showEndDot={false}
              />
              <div className="flex w-20 flex-col items-end">
                <span
                  className={cn(
                    "font-mono font-tabular text-small tabular-nums",
                    tone === "success" ? "text-success" : "text-danger",
                  )}
                >
                  {tone === "success" ? "+" : "−"}$
                  {Math.abs(Math.round(r.changeDollars)).toLocaleString()}
                </span>
                <DeltaChip value={r.changePct} size="sm" hideIcon />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
