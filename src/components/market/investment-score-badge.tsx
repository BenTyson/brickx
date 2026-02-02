import { cn } from "@/lib/utils/cn";

interface InvestmentScoreBadgeProps {
  score: number | null;
  className?: string;
}

export function InvestmentScoreBadge({
  score,
  className,
}: InvestmentScoreBadgeProps) {
  if (score == null) {
    return (
      <span
        className={cn(
          "text-muted-foreground inline-flex items-center text-sm",
          className,
        )}
      >
        N/A
      </span>
    );
  }

  const rounded = Math.round(score);
  let colorClass: string;
  let label: string;

  if (rounded >= 80) {
    colorClass = "bg-green-500/15 text-green-500";
    label = "Excellent";
  } else if (rounded >= 60) {
    colorClass = "bg-blue-500/15 text-blue-500";
    label = "Good";
  } else if (rounded >= 40) {
    colorClass = "bg-yellow-500/15 text-yellow-500";
    label = "Fair";
  } else {
    colorClass = "bg-red-500/15 text-red-500";
    label = "Low";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-medium",
        colorClass,
        className,
      )}
      title={`Investment score: ${rounded}/100 (${label})`}
    >
      {rounded}
    </span>
  );
}
