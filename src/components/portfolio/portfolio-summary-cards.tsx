import { DollarSign, TrendingUp, Package, PiggyBank } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import type { PortfolioSummary } from "@/lib/types/collection";

interface PortfolioSummaryCardsProps {
  summary: PortfolioSummary;
}

export function PortfolioSummaryCards({ summary }: PortfolioSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Value"
        value={`$${summary.total_value.toFixed(2)}`}
        icon={DollarSign}
      />
      <StatCard
        label="Cost Basis"
        value={`$${summary.total_cost.toFixed(2)}`}
        icon={PiggyBank}
      />
      <StatCard
        label="Gain / Loss"
        value={`${summary.gain_loss >= 0 ? "+" : ""}$${summary.gain_loss.toFixed(2)}`}
        delta={summary.gain_loss_pct}
        icon={TrendingUp}
      />
      <StatCard
        label="Total Sets"
        value={summary.total_sets.toString()}
        icon={Package}
      />
    </div>
  );
}
