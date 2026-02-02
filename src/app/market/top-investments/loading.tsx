import { PageContainer } from "@/components/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { SetCardSkeleton } from "@/components/catalog/set-card-skeleton";

export default function TopInvestmentsLoading() {
  return (
    <div className="py-8">
      <PageContainer className="space-y-8">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-1 h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-80" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <SetCardSkeleton key={i} />
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
