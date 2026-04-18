import Link from "next/link";
import { Sparkline } from "@/components/charts/sparkline";
import { DeltaChip } from "@/components/ui/delta-chip";
import { cn } from "@/lib/utils/cn";
import type { CorrelatedSet } from "@/lib/mock/set-detail";

interface CorrelatedGridProps {
  sets: CorrelatedSet[];
}

function correlationTone(corr: number): "success" | "danger" | "muted" {
  if (corr >= 0.6) return "success";
  if (corr <= -0.4) return "danger";
  return "muted";
}

export function CorrelatedGrid({ sets }: CorrelatedGridProps) {
  if (!sets.length) return null;
  return (
    <section
      aria-labelledby="correlated-sets"
      className="space-y-5 rounded-2xl border border-border-thin bg-card p-6 lg:p-8"
    >
      <header>
        <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
          05 · Correlation
        </div>
        <h2
          id="correlated-sets"
          className="mt-2 text-h3 font-medium tracking-tight text-text-primary"
        >
          Sets that moved together
        </h2>
        <p className="mt-2 max-w-2xl text-small text-text-tertiary">
          Pearson correlation over the last 90 days of blended price. Useful for
          diversification — sets above 0.6 mostly track the same macro signal.
        </p>
      </header>
      <ul className="grid gap-px overflow-hidden rounded-xl border border-border-thin bg-border-thin">
        {sets.map((s) => {
          const tone = correlationTone(s.correlation);
          return (
            <li
              key={s.id}
              className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 bg-bg-raised px-4 py-3 sm:grid-cols-[auto_1fr_120px_auto_auto]"
            >
              <Link
                href={`/demo/sets/${s.id}`}
                className="text-micro font-mono font-tabular text-text-tertiary transition hover:text-text-primary"
              >
                {s.id}
              </Link>
              <div className="min-w-0">
                <Link
                  href={`/demo/sets/${s.id}`}
                  className="line-clamp-1 text-small font-medium text-text-primary transition hover:text-accent"
                >
                  {s.name}
                </Link>
                <div className="text-[10px] font-mono font-tabular uppercase tracking-[0.06em] text-text-quaternary">
                  {s.theme}
                </div>
              </div>
              <Sparkline
                data={s.sparkline}
                width={120}
                height={28}
                className="hidden h-7 sm:block"
                showEndDot={false}
              />
              <DeltaChip value={s.pctChange30d} size="sm" hideIcon />
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-mono font-tabular tabular-nums",
                  tone === "success"
                    ? "bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-success"
                    : tone === "danger"
                      ? "bg-[color-mix(in_oklab,var(--danger)_14%,transparent)] text-danger"
                      : "bg-bg-overlay text-text-tertiary",
                )}
              >
                ρ {s.correlation >= 0 ? "+" : ""}
                {s.correlation.toFixed(2)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
