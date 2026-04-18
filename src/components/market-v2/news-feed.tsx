import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, Repeat2, Bell, BarChart2, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { NewsItem, NewsKind } from "@/lib/mock/indices";

const KIND_META: Record<
  NewsKind,
  { label: string; Icon: React.ElementType; color: string }
> = {
  retirement: {
    label: "Retirement",
    Icon: Bell,
    color: "text-warning bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
  },
  "re-release": {
    label: "Re-release",
    Icon: Repeat2,
    color: "text-[#8B5CF6] bg-[color-mix(in_oklab,#8B5CF6_12%,transparent)]",
  },
  announcement: {
    label: "Announcement",
    Icon: Zap,
    color: "text-accent bg-accent/10",
  },
  market: {
    label: "Market",
    Icon: BarChart2,
    color: "text-text-secondary bg-bg-overlay",
  },
  data: {
    label: "Data",
    Icon: BarChart2,
    color: "text-text-secondary bg-bg-overlay",
  },
};

const IMPACT_ICON: Record<string, React.ElementType> = {
  positive: TrendingUp,
  negative: TrendingDown,
  neutral: Minus,
};
const IMPACT_COLOR: Record<string, string> = {
  positive: "text-success",
  negative: "text-danger",
  neutral: "text-text-quaternary",
};

function fmtDate(raw: string) {
  const d = new Date(raw);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface NewsFeedProps {
  items: NewsItem[];
  limit?: number;
  className?: string;
}

export function NewsFeed({ items, limit, className }: NewsFeedProps) {
  const visible = limit ? items.slice(0, limit) : items;

  return (
    <section className={cn("rounded-2xl border border-border-thin bg-bg-raised", className)}>
      <div className="border-b border-border-thin px-5 py-4 sm:px-6">
        <div className="text-micro font-mono font-tabular text-text-tertiary">LEGO market news</div>
        <div className="mt-1 font-serif-display text-[22px] leading-tight text-text-primary">
          What&rsquo;s moving the market.
        </div>
      </div>

      <ul className="divide-y divide-[var(--border-thin)]">
        {visible.map((item) => {
          const meta = KIND_META[item.kind];
          const ImpactIcon = item.impact ? IMPACT_ICON[item.impact] : null;
          return (
            <li key={item.id} className="group px-5 py-4 transition hover:bg-bg-overlay sm:px-6">
              <div className="flex items-start gap-3">
                {/* Kind icon */}
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[13px]",
                    meta.color,
                  )}
                >
                  <meta.Icon className="size-3.5" aria-hidden />
                </span>

                <div className="min-w-0 flex-1">
                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("text-micro font-mono font-tabular uppercase tracking-[0.06em]", meta.color.split(" ")[0])}>
                      {meta.label}
                    </span>
                    {item.setId && (
                      <>
                        <span className="text-text-quaternary">·</span>
                        <Link
                          href={`/demo/sets/${item.setId}`}
                          className="text-micro font-mono font-tabular text-accent hover:underline"
                        >
                          #{item.setId}
                        </Link>
                      </>
                    )}
                    {item.impact && ImpactIcon && (
                      <>
                        <span className="text-text-quaternary">·</span>
                        <span className={cn("flex items-center gap-0.5 text-micro font-mono font-tabular", IMPACT_COLOR[item.impact])}>
                          <ImpactIcon className="size-3" aria-hidden />
                          {item.impact}
                        </span>
                      </>
                    )}
                    <span className="ml-auto text-micro font-mono font-tabular text-text-quaternary">
                      {fmtDate(item.date)}
                    </span>
                  </div>

                  {/* Headline */}
                  <div className="mt-1 text-small font-medium leading-snug text-text-primary">
                    {item.headline}
                  </div>

                  {/* Summary */}
                  <p className="mt-1 text-small text-text-secondary leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
