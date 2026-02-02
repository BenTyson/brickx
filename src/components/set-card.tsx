import Image from "next/image";
import Link from "next/link";
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
import type { CatalogSet } from "@/lib/types/catalog";

interface SetCardProps {
  set: CatalogSet;
  className?: string;
}

export function SetCard({ set, className }: SetCardProps) {
  return (
    <Link href={`/sets/${set.id}`} className="group">
      <Card
        className={cn(
          "transition-all group-hover:scale-[1.02] group-hover:shadow-lg",
          className,
        )}
      >
        <CardHeader className="pb-0">
          {set.img_url ? (
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={set.img_url}
                alt={set.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="bg-muted flex aspect-square items-center justify-center rounded-lg">
              <Package className="text-muted-foreground/50 size-12" />
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <StatusBadge status={set.status} />
          </div>
          <div>
            <h3 className="line-clamp-1 leading-tight font-semibold">
              {set.name}
            </h3>
            <p className="text-muted-foreground text-sm">
              {set.id} &middot; {set.theme_name ?? "Unknown"} &middot;{" "}
              {set.year}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1">
          <div className="flex w-full items-baseline justify-between">
            <span className="text-muted-foreground text-xs">
              {set.msrp_usd != null
                ? `MSRP $${set.msrp_usd.toFixed(2)}`
                : "MSRP \u2014"}
            </span>
            <span className="text-lg font-bold">
              {set.market_value_new != null
                ? `$${set.market_value_new.toFixed(2)}`
                : "N/A"}
            </span>
          </div>
          <div className="flex w-full justify-end">
            {set.pct_change_30d != null ? (
              <PriceChange value={set.pct_change_30d} />
            ) : (
              <span className="text-muted-foreground text-sm">N/A</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
