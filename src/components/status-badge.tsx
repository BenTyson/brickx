import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

type SetStatus =
  | "available"
  | "retired"
  | "retiring-soon"
  | "exclusive"
  | "unreleased";

interface StatusBadgeProps {
  status: SetStatus;
  className?: string;
}

const statusConfig: Record<SetStatus, { label: string; className: string }> = {
  available: {
    label: "Available",
    className: "bg-success/15 text-success border-success/25",
  },
  retired: {
    label: "Retired",
    className: "bg-destructive/15 text-destructive border-destructive/25",
  },
  "retiring-soon": {
    label: "Retiring Soon",
    className: "bg-warning/15 text-warning border-warning/25",
  },
  exclusive: {
    label: "Exclusive",
    className: "bg-info/15 text-info border-info/25",
  },
  unreleased: {
    label: "Unreleased",
    className:
      "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/25",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
