"use client";

import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { cn } from "@/lib/utils/cn";
import { themeColor, type RiskReturnPoint } from "@/lib/mock/portfolio";

interface RiskReturnScatterProps {
  points: RiskReturnPoint[];
  className?: string;
}

function TooltipContent({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: RiskReturnPoint }>;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-md border border-border-emphasis bg-popover px-3 py-2 shadow-xl">
      <div className="text-small text-text-primary">{p.name}</div>
      <div className="mt-0.5 text-micro font-mono font-tabular text-text-tertiary">
        {p.theme} · #{p.id}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3 font-mono font-tabular text-[11px] tabular-nums">
        <div>
          <div className="text-text-tertiary">Return</div>
          <div className={p.returnPct >= 0 ? "text-success" : "text-danger"}>
            {p.returnPct >= 0 ? "+" : ""}
            {p.returnPct.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-text-tertiary">Volatility</div>
          <div className="text-text-primary">{p.volatility.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}

export function RiskReturnScatter({ points, className }: RiskReturnScatterProps) {
  // Group by theme so the legend colors cleanly.
  const byTheme = new Map<string, RiskReturnPoint[]>();
  for (const p of points) {
    const arr = byTheme.get(p.theme) ?? [];
    arr.push(p);
    byTheme.set(p.theme, arr);
  }

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
            Risk vs. return
          </div>
          <div className="mt-1 font-serif-display text-[22px] leading-tight text-text-primary">
            Your portfolio, plotted.
          </div>
        </div>
        <div className="text-micro font-mono font-tabular text-text-quaternary">
          size = $ held
        </div>
      </div>

      <div className="mt-4 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="var(--border-thin)"
            />
            <XAxis
              type="number"
              dataKey="volatility"
              name="Volatility"
              unit="%"
              tick={{
                fill: "var(--text-tertiary)",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
              }}
              tickLine={false}
              axisLine={{ stroke: "var(--border-thin)" }}
              label={{
                value: "Volatility →",
                position: "insideBottom",
                offset: -8,
                fill: "var(--text-tertiary)",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
              }}
              domain={["auto", "auto"]}
            />
            <YAxis
              type="number"
              dataKey="returnPct"
              name="Return"
              unit="%"
              tick={{
                fill: "var(--text-tertiary)",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
              }}
              tickLine={false}
              axisLine={{ stroke: "var(--border-thin)" }}
              width={44}
              domain={["auto", "auto"]}
            />
            <ZAxis type="number" dataKey="value" range={[40, 420]} />
            <Tooltip
              content={<TooltipContent />}
              cursor={{ stroke: "var(--text-quaternary)", strokeDasharray: "2 4" }}
            />
            {[...byTheme.entries()].map(([theme, pts]) => {
              const slug = slugify(theme);
              const c = themeColor(slug);
              return (
                <Scatter
                  key={theme}
                  name={theme}
                  data={pts}
                  fill={c}
                  fillOpacity={0.55}
                  stroke={c}
                  strokeWidth={1}
                />
              );
            })}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
