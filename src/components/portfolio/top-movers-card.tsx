import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CollectionMover } from "@/lib/types/collection";

interface Props {
  gainers: CollectionMover[];
  losers: CollectionMover[];
}

function Row({ mover }: { mover: CollectionMover }) {
  const pct = mover.pct_change_30d ?? 0;
  const up = pct >= 0;
  return (
    <Link
      href={`/sets/${mover.set_id}`}
      className="hover:bg-muted/50 flex items-center justify-between rounded-md px-2 py-2 text-sm"
    >
      <div className="min-w-0 flex-1 truncate pr-2">
        <div className="truncate font-medium">{mover.set_name}</div>
        {mover.theme_name && (
          <div className="text-muted-foreground truncate text-xs">
            {mover.theme_name}
          </div>
        )}
      </div>
      <div
        className={`font-tabular flex items-center gap-1 text-sm font-medium ${
          up ? "text-emerald-500" : "text-red-500"
        }`}
      >
        {up ? (
          <ArrowUpRight className="size-3" />
        ) : (
          <ArrowDownRight className="size-3" />
        )}
        {up ? "+" : ""}
        {pct.toFixed(2)}%
      </div>
    </Link>
  );
}

export function TopMoversCard({ gainers, losers }: Props) {
  const hasData = gainers.length > 0 || losers.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top movers (30d)</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div>
          <div className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
            Gainers
          </div>
          {gainers.length === 0 ? (
            <p className="text-muted-foreground py-3 text-sm">None</p>
          ) : (
            <div className="space-y-1">
              {gainers.map((m) => (
                <Row key={m.set_id} mover={m} />
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
            Losers
          </div>
          {losers.length === 0 ? (
            <p className="text-muted-foreground py-3 text-sm">None</p>
          ) : (
            <div className="space-y-1">
              {losers.map((m) => (
                <Row key={m.set_id} mover={m} />
              ))}
            </div>
          )}
        </div>
        {!hasData && (
          <p className="text-muted-foreground col-span-full py-3 text-sm">
            No recent price movement data for sets in your collections.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
