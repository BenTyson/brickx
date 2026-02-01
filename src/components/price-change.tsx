import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PriceChangeProps {
  value: number;
  label?: string;
  className?: string;
}

export function PriceChange({ value, label, className }: PriceChangeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const Icon = isPositive ? ArrowUp : isNegative ? ArrowDown : Minus;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-sm font-medium",
        isPositive && "text-success",
        isNegative && "text-destructive",
        !isPositive && !isNegative && "text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      <span>
        {isPositive ? "+" : ""}
        {value.toFixed(1)}%
      </span>
      {label && <span className="text-muted-foreground text-xs">{label}</span>}
    </span>
  );
}
