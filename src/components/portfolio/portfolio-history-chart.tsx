"use client";

import { useState, useTransition } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type {
  PortfolioHistory,
  PortfolioHistoryRange,
} from "@/lib/types/collection";

const RANGES: PortfolioHistoryRange[] = ["1W", "1M", "3M", "1Y", "ALL"];

interface Props {
  initial: PortfolioHistory;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

function formatDollar(value: number): string {
  if (value >= 10_000) return `$${Math.round(value / 1000)}k`;
  return `$${value.toFixed(0)}`;
}

interface TipEntry {
  value: number;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover text-popover-foreground rounded-lg border p-3 text-sm shadow-md">
      <p className="mb-1 font-medium">{label ? formatDate(label) : ""}</p>
      <p className="font-tabular">${payload[0].value.toFixed(2)}</p>
    </div>
  );
}

export function PortfolioHistoryChart({ initial }: Props) {
  const [history, setHistory] = useState(initial);
  const [pending, startTransition] = useTransition();

  async function loadRange(range: PortfolioHistoryRange) {
    startTransition(async () => {
      const res = await fetch(
        `/api/portfolio/history?range=${encodeURIComponent(range)}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const data = (await res.json()) as PortfolioHistory;
      setHistory(data);
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Portfolio Value</CardTitle>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={history.range === r ? "default" : "ghost"}
              onClick={() => loadRange(r)}
              disabled={pending}
            >
              {r}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {history.points.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <TrendingUp className="text-muted-foreground/50 mb-4 size-12" />
            <p className="text-muted-foreground text-sm font-medium">
              No snapshots yet
            </p>
            <p className="text-muted-foreground/75 mt-1 text-xs">
              Your portfolio value will chart here once daily snapshots run.
            </p>
          </div>
        ) : (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={history.points}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-chart-1)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-chart-1)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  className="text-xs"
                  tick={{ fill: "var(--color-muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={formatDollar}
                  className="text-xs font-tabular"
                  tick={{ fill: "var(--color-muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total_value"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#portfolioFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
