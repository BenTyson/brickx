import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ThemeAttribution } from "@/lib/types/collection";

interface Props {
  attribution: ThemeAttribution[];
  range: string;
}

export function ThemeAttributionCard({ attribution, range }: Props) {
  const top = attribution.slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by theme ({range})</CardTitle>
      </CardHeader>
      <CardContent>
        {top.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Not enough snapshots yet to attribute theme-level performance.
          </p>
        ) : (
          <div className="space-y-3">
            {top.map((row) => {
              const up = row.gain >= 0;
              return (
                <div
                  key={row.theme}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="truncate pr-4 font-medium">{row.theme}</div>
                  <div
                    className={`font-tabular ${up ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {up ? "+" : "-"}${Math.abs(row.gain).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
