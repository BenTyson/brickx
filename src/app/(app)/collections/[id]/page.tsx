import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { fetchCollectionDetail } from "@/lib/queries";
import { CollectionItemsTable } from "@/components/collections/collection-items-table";
import { ImportDialog } from "@/components/collections/import-dialog";
import { ExportButton } from "@/components/collections/export-button";
import { DeltaChip } from "@/components/ui/delta-chip";

interface CollectionDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CollectionDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const collection = await fetchCollectionDetail(id);
  if (!collection) return { title: "Collection Not Found | BrickX" };
  return {
    title: `${collection.name} | BrickX`,
    description: `View and manage your "${collection.name}" collection on BrickX.`,
  };
}

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { id } = await params;
  const collection = await fetchCollectionDetail(id);
  if (!collection) notFound();

  const totalValue = collection.items.reduce((sum, item) => {
    const value =
      item.condition === "new"
        ? (item.market_value_new ?? 0)
        : (item.market_value_used ?? 0);
    return sum + value;
  }, 0);
  const totalCost = collection.items.reduce(
    (sum, item) => sum + (item.purchase_price ?? 0),
    0,
  );
  const gain = totalValue - totalCost;
  const gainPct = totalCost > 0 ? (gain / totalCost) * 100 : 0;

  return (
    <main className="bg-bg-base pb-24">
      <div className="mx-auto max-w-[1320px] px-6 pt-8 sm:px-10 lg:px-14">
        <Link
          href="/collections"
          className="inline-flex items-center gap-1 text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary transition hover:text-text-primary"
        >
          <ChevronLeft className="size-3" aria-hidden />
          Collections
        </Link>
      </div>

      <div className="mx-auto max-w-[1320px] px-6 pb-6 pt-4 sm:px-10 lg:px-14">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
              Collection
            </div>
            <h1 className="mt-2 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[52px]">
              {collection.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 border-t border-border-thin pt-4 text-small">
              <Stat
                label="Sets"
                value={collection.items.length.toString()}
              />
              {totalValue > 0 && (
                <Stat
                  label="Market value"
                  value={`$${Math.round(totalValue).toLocaleString()}`}
                />
              )}
              {totalCost > 0 && (
                <Stat
                  label="Cost basis"
                  value={`$${Math.round(totalCost).toLocaleString()}`}
                />
              )}
              {totalCost > 0 && totalValue > 0 && (
                <div className="min-w-[96px]">
                  <div className="text-micro font-mono font-tabular text-text-tertiary">
                    Gain
                  </div>
                  <div className="mt-1">
                    <DeltaChip value={gainPct} size="sm" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <ImportDialog collectionId={collection.id} />
            <ExportButton collectionId={collection.id} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-14">
        <CollectionItemsTable items={collection.items} />
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[96px]">
      <div className="text-micro font-mono font-tabular text-text-tertiary">
        {label}
      </div>
      <div className="mt-1 font-mono font-tabular tabular-nums text-text-primary">
        {value}
      </div>
    </div>
  );
}
