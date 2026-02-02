import { Package } from "lucide-react";
import { SetCard } from "@/components/set-card";
import type { CatalogSet } from "@/lib/types/catalog";

interface CatalogGridProps {
  sets: CatalogSet[];
  hasFilters: boolean;
  onClearFilters?: string;
}

export function CatalogGrid({
  sets,
  hasFilters,
  onClearFilters,
}: CatalogGridProps) {
  if (sets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="text-muted-foreground/50 mb-4 size-12" />
        <h3 className="text-lg font-semibold">No sets found</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          {hasFilters
            ? "Try adjusting your search or filters."
            : "No sets are available at this time."}
        </p>
        {hasFilters && onClearFilters && (
          <a
            href={onClearFilters}
            className="text-primary mt-4 text-sm hover:underline"
          >
            Clear all filters
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sets.map((set) => (
        <SetCard key={set.id} set={set} />
      ))}
    </div>
  );
}
