import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { fetchCollectionDetail } from "@/lib/queries";
import { CollectionItemsTable } from "@/components/collections/collection-items-table";

interface CollectionDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CollectionDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const collection = await fetchCollectionDetail(id);

  if (!collection) {
    return { title: "Collection Not Found | BrickX" };
  }

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

  if (!collection) {
    notFound();
  }

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

  return (
    <PageContainer className="space-y-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-muted-foreground flex items-center gap-1 text-sm">
        <Link
          href="/collections"
          className="hover:text-foreground transition-colors"
        >
          Collections
        </Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground font-medium">{collection.name}</span>
      </nav>

      {/* Header + Summary */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{collection.name}</h1>
        <div className="text-muted-foreground mt-2 flex flex-wrap gap-4 text-sm">
          <span>
            {collection.items.length}{" "}
            {collection.items.length === 1 ? "set" : "sets"}
          </span>
          {totalValue > 0 && (
            <span>
              Value:{" "}
              <span className="text-foreground font-medium">
                ${totalValue.toFixed(2)}
              </span>
            </span>
          )}
          {totalCost > 0 && (
            <span>
              Cost:{" "}
              <span className="text-foreground font-medium">
                ${totalCost.toFixed(2)}
              </span>
            </span>
          )}
          {totalCost > 0 && totalValue > 0 && (
            <span
              className={
                totalValue - totalCost >= 0
                  ? "text-success"
                  : "text-destructive"
              }
            >
              {totalValue - totalCost >= 0 ? "+" : ""}
              {(((totalValue - totalCost) / totalCost) * 100).toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* Items Table */}
      <CollectionItemsTable items={collection.items} />
    </PageContainer>
  );
}
