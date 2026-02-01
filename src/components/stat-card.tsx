import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("gap-2 py-4", className)}>
      <CardContent className="flex items-center gap-4">
        {Icon && (
          <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
            <Icon className="text-primary size-5" aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {delta !== undefined && (
            <p
              className={cn(
                "text-xs font-medium",
                delta > 0 && "text-success",
                delta < 0 && "text-destructive",
                delta === 0 && "text-muted-foreground",
              )}
            >
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)}%
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
