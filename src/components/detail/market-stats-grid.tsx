import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Target,
  Tag,
  Activity,
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import type { CatalogSet } from "@/lib/types/catalog";

interface MarketStatsGridProps {
  set: CatalogSet;
}

function formatPrice(value: number | null): string {
  if (value == null) return "N/A";
  return `$${value.toFixed(2)}`;
}

function formatPct(value: number | null): string {
  if (value == null) return "N/A";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function formatScore(value: number | null): string {
  if (value == null) return "N/A";
  return `${value.toFixed(0)} / 100`;
}

export function MarketStatsGrid({ set }: MarketStatsGridProps) {
  const stats = [
    {
      label: "Market Value (New)",
      value: formatPrice(set.market_value_new),
      icon: DollarSign,
      delta: undefined,
    },
    {
      label: "Market Value (Used)",
      value: formatPrice(set.market_value_used),
      icon: Tag,
      delta: undefined,
    },
    {
      label: "7-Day Change",
      value: formatPct(set.pct_change_7d),
      icon: Activity,
      delta: set.pct_change_7d ?? undefined,
    },
    {
      label: "30-Day Change",
      value: formatPct(set.pct_change_30d),
      icon: TrendingUp,
      delta: set.pct_change_30d ?? undefined,
    },
    {
      label: "90-Day Change",
      value: formatPct(set.pct_change_90d),
      icon: TrendingDown,
      delta: set.pct_change_90d ?? undefined,
    },
    {
      label: "Annual Growth",
      value: formatPct(set.growth_annual_pct),
      icon: Calendar,
      delta: set.growth_annual_pct ?? undefined,
    },
    {
      label: "Investment Score",
      value: formatScore(set.investment_score),
      icon: Target,
      delta: undefined,
    },
    {
      label: "MSRP",
      value: formatPrice(set.msrp_usd),
      icon: BarChart3,
      delta: undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          delta={stat.delta}
        />
      ))}
    </div>
  );
}
