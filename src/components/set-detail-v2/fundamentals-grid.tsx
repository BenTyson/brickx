import { Coins, LineChart, Puzzle, Sparkles, Tag, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { SetDetailFundamentals } from "@/lib/mock/set-detail";

interface FundamentalsGridProps {
  fundamentals: SetDetailFundamentals;
  className?: string;
}

interface Cell {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  hint?: string;
}

export function FundamentalsGrid({
  fundamentals: f,
  className,
}: FundamentalsGridProps) {
  const cells: Cell[] = [
    { icon: Tag, label: "MSRP", value: `$${f.msrp.toFixed(0)}`, hint: "release price" },
    {
      icon: Puzzle,
      label: "Parts",
      value: f.parts.toLocaleString(),
      hint: f.parts > 0 ? `$${f.pricePerPart.toFixed(2)}/part now` : undefined,
    },
    {
      icon: Users,
      label: "Minifigs",
      value: f.minifigs.toString(),
    },
    {
      icon: Coins,
      label: "MSRP $/part",
      value: f.parts > 0 ? `$${f.msrpPerPart.toFixed(3)}` : "—",
      hint: "at release",
    },
    {
      icon: LineChart,
      label: "CAGR",
      value: `${f.cagr.toFixed(1)}%`,
      hint: `${f.yearsSinceRelease}y since release`,
    },
    {
      icon: Sparkles,
      label: "Projected retirement",
      value: f.projectedRetirement ?? "Retired",
      hint: f.projectedRetirement ? "model estimate" : "no longer produced",
    },
  ];
  return (
    <section
      aria-labelledby="fundamentals"
      className={cn(
        "space-y-5 rounded-2xl border border-border-thin bg-card p-6 lg:p-8",
        className,
      )}
    >
      <header>
        <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
          02 · Fundamentals
        </div>
        <h2
          id="fundamentals"
          className="mt-2 text-h3 font-medium tracking-tight text-text-primary"
        >
          What you&rsquo;re holding
        </h2>
      </header>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border-thin bg-border-thin lg:grid-cols-3">
        {cells.map((c) => (
          <div key={c.label} className="flex flex-col gap-1 bg-bg-raised p-4">
            <div className="flex items-center gap-2 text-text-tertiary">
              <c.icon className="size-3.5" strokeWidth={2} />
              <span className="text-micro font-mono font-tabular tracking-[0.08em]">
                {c.label}
              </span>
            </div>
            <span className="font-mono font-tabular tabular-nums text-xl text-text-primary">
              {c.value}
            </span>
            {c.hint && (
              <span className="text-[10px] font-mono font-tabular uppercase tracking-[0.06em] text-text-quaternary">
                {c.hint}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
