import Link from "next/link";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Sparkline } from "@/components/charts/sparkline";
import type { RetiringSoonEntry } from "@/lib/mock/indices";

interface RetiringCardProps {
  entry: RetiringSoonEntry;
  className?: string;
}

function RiskBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "var(--danger)" : score >= 40 ? "var(--warning)" : "var(--success)";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-overlay">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span
        className="min-w-[2rem] text-right text-micro font-mono font-tabular tabular-nums"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

export function RetiringCard({ entry, className }: RetiringCardProps) {
  const { set, monthsLeft, retirementAppreciation, riskScore, sparkline } = entry;
  const urgency = monthsLeft <= 3 ? "danger" : monthsLeft <= 6 ? "warning" : "muted";
  const urgencyColor =
    urgency === "danger"
      ? "text-danger bg-[color-mix(in_oklab,var(--danger)_14%,transparent)] border-[color-mix(in_oklab,var(--danger)_30%,transparent)]"
      : urgency === "warning"
        ? "text-warning bg-[color-mix(in_oklab,var(--warning)_14%,transparent)] border-[color-mix(in_oklab,var(--warning)_30%,transparent)]"
        : "text-text-secondary bg-bg-overlay border-border-thin";

  return (
    <Link
      href={`/demo/sets/${set.id}`}
      className={cn(
        "group flex flex-col gap-3 rounded-2xl border border-border-thin bg-bg-raised p-5 transition hover:border-border-emphasis hover:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
        className,
      )}
    >
      {/* Countdown chip */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-micro font-mono font-tabular",
            urgencyColor,
          )}
        >
          <Clock className="size-3" aria-hidden />
          ~{monthsLeft} {monthsLeft === 1 ? "month" : "months"} left
        </span>
        <span className="text-micro font-mono font-tabular text-text-quaternary">
          #{set.id}
        </span>
      </div>

      {/* Set name */}
      <div>
        <div className="font-medium text-text-primary transition group-hover:text-accent-hover">
          {set.name}
        </div>
        <div className="mt-0.5 text-micro font-mono font-tabular text-text-tertiary">
          {set.theme} · {set.year}
        </div>
      </div>

      {/* Price + sparkline */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="font-mono font-tabular text-[22px] tabular-nums text-text-primary">
            ${set.currentValue.toLocaleString()}
          </div>
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            MSRP ${set.msrp.toLocaleString()}
          </div>
        </div>
        <Sparkline
          data={sparkline}
          width={72}
          height={28}
          tone="accent"
          showEndDot={false}
          ariaLabel={`${set.name} price sparkline`}
        />
      </div>

      {/* Retirement appreciation reference */}
      <div className="rounded-lg border border-border-thin bg-bg-overlay px-3 py-2">
        <div className="text-micro font-mono font-tabular text-text-tertiary">
          Avg post-retirement appreciation (similar sets)
        </div>
        <div className="mt-1 font-mono font-tabular text-small tabular-nums text-success">
          +{retirementAppreciation}% avg
        </div>
      </div>

      {/* Risk score */}
      <div>
        <div className="mb-1.5 text-micro font-mono font-tabular text-text-tertiary">
          Volatility risk score
        </div>
        <RiskBar score={riskScore} />
      </div>
    </Link>
  );
}
