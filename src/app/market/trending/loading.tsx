import { PageContainer } from "@/components/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { SetCardSkeleton } from "@/components/catalog/set-card-skeleton";

export default function TrendingLoading() {
  return (
    <div className="py-8">
      <PageContainer className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="mt-1 h-5 w-72" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <SetCardSkeleton key={i} />
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
