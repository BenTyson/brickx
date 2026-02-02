import { PageContainer } from "@/components/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionDetailLoading() {
  return (
    <PageContainer className="space-y-6 py-8">
      <Skeleton className="h-5 w-48" />
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </PageContainer>
  );
}
