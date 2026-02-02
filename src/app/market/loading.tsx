import { PageContainer } from "@/components/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { SetCardSkeleton } from "@/components/catalog/set-card-skeleton";

export default function MarketLoading() {
  return (
    <div className="py-8">
      <PageContainer className="space-y-10">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-5 w-96" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>

        <div>
          <Skeleton className="mb-4 h-8 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SetCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
