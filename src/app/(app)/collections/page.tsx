import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { fetchUserCollections } from "@/lib/queries";
import { CollectionCard } from "@/components/collections/collection-card";
import { CreateCollectionDialog } from "@/components/collections/create-collection-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FoldersIllustration } from "@/components/illustrations";

export const metadata: Metadata = {
  title: "My Collections | BrickX",
  description: "Manage your LEGO set collections.",
};

export default async function CollectionsPage() {
  const collections = await fetchUserCollections();

  return (
    <PageContainer className="space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Collections</h1>
          <p className="text-muted-foreground mt-1">
            Organize and track your LEGO sets
          </p>
        </div>
        <CreateCollectionDialog />
      </div>

      {collections.length === 0 ? (
        <EmptyState
          illustration={<FoldersIllustration />}
          title="Make room for the first one."
          description="Group your sets by theme, era, or shelf. Collections make portfolio math and bulk actions tidy."
          action={<CreateCollectionDialog />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
