import type { Metadata } from "next";
import { FolderOpen } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { fetchUserCollections } from "@/lib/queries";
import { CollectionCard } from "@/components/collections/collection-card";
import { CreateCollectionDialog } from "@/components/collections/create-collection-dialog";

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
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <FolderOpen className="text-muted-foreground/50 mb-4 size-12" />
          <h2 className="text-lg font-semibold">No collections yet</h2>
          <p className="text-muted-foreground mt-1 max-w-sm text-sm">
            Create your first collection to start tracking your LEGO sets and
            their value.
          </p>
          <div className="mt-4">
            <CreateCollectionDialog />
          </div>
        </div>
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
