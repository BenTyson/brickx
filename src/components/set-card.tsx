import { Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { PriceChange } from "@/components/price-change";
import { cn } from "@/lib/utils/cn";

interface SetCardProps {
  name: string;
  setNumber: string;
  theme: string;
  year: number;
  status:
    | "available"
    | "retired"
    | "retiring-soon"
    | "exclusive"
    | "unreleased";
  msrp: number;
  marketValue: number;
  changePercent: number;
  className?: string;
}

export function SetCard({
  name,
  setNumber,
  theme,
  year,
  status,
  msrp,
  marketValue,
  changePercent,
  className,
}: SetCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg",
        className,
      )}
    >
      <CardHeader className="pb-0">
        {/* Placeholder image */}
        <div className="bg-muted flex aspect-square items-center justify-center rounded-lg">
          <Package className="text-muted-foreground/50 size-12" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <StatusBadge status={status} />
        </div>
        <div>
          <h3 className="line-clamp-1 leading-tight font-semibold">{name}</h3>
          <p className="text-muted-foreground text-sm">
            {setNumber} &middot; {theme} &middot; {year}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1">
        <div className="flex w-full items-baseline justify-between">
          <span className="text-muted-foreground text-xs">
            MSRP ${msrp.toFixed(2)}
          </span>
          <span className="text-lg font-bold">${marketValue.toFixed(2)}</span>
        </div>
        <div className="flex w-full justify-end">
          <PriceChange value={changePercent} />
        </div>
      </CardFooter>
    </Card>
  );
}
