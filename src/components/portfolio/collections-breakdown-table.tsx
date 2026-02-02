import Link from "next/link";
import type { PortfolioSummary } from "@/lib/types/collection";

interface CollectionsBreakdownTableProps {
  collections: PortfolioSummary["collections"];
}

export function CollectionsBreakdownTable({
  collections,
}: CollectionsBreakdownTableProps) {
  if (collections.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold tracking-tight">
        Collection Breakdown
      </h2>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="px-4 py-3 text-left font-medium">Collection</th>
              <th className="px-4 py-3 text-right font-medium">Items</th>
              <th className="px-4 py-3 text-right font-medium">Value</th>
              <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">
                Cost
              </th>
              <th className="px-4 py-3 text-right font-medium">Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((coll) => (
              <tr key={coll.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/collections/${coll.id}`}
                    className="hover:text-primary font-medium transition-colors"
                  >
                    {coll.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right">{coll.item_count}</td>
                <td className="px-4 py-3 text-right font-medium">
                  ${coll.total_value.toFixed(2)}
                </td>
                <td className="hidden px-4 py-3 text-right sm:table-cell">
                  ${coll.total_cost.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={
                      coll.gain_loss_pct >= 0
                        ? "text-success"
                        : "text-destructive"
                    }
                  >
                    {coll.gain_loss_pct >= 0 ? "+" : ""}
                    {coll.gain_loss_pct.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
