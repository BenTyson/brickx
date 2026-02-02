import { SetCard } from "@/components/set-card";
import type { CatalogSet } from "@/lib/types/catalog";

interface RelatedSetsProps {
  sets: CatalogSet[];
}

export function RelatedSets({ sets }: RelatedSetsProps) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold tracking-tight">Related Sets</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sets.map((set) => (
          <SetCard key={set.id} set={set} />
        ))}
      </div>
    </div>
  );
}
