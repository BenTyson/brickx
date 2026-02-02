import { PageContainer } from "@/components/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { SetCardSkeleton } from "@/components/catalog/set-card-skeleton";

export default function SetDetailLoading() {
  return (
    <div className="py-8">
      <PageContainer className="space-y-8">
        {/* Breadcrumb skeleton */}
        <Skeleton className="h-5 w-64" />

        {/* Hero: Image + Info */}
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* Image skeleton */}
          <Skeleton className="aspect-square w-full max-w-[400px] rounded-xl" />

          {/* Info panel skeleton */}
          <div className="space-y-4">
            <div>
              <Skeleton className="mb-2 h-6 w-20" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="mt-2 h-6 w-32" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="mt-1 h-5 w-24" />
                </div>
              ))}
            </div>

            {/* Market value highlight skeleton */}
            <div className="rounded-lg border p-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-2 h-9 w-32" />
              <Skeleton className="mt-2 h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Market Stats skeleton */}
        <Skeleton className="h-px w-full" />
        <div>
          <Skeleton className="mb-4 h-8 w-48" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-2 h-8 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Price Chart skeleton */}
        <Skeleton className="h-px w-full" />
        <div className="rounded-lg border p-6">
          <Skeleton className="mb-4 h-6 w-32" />
          <Skeleton className="h-[350px] w-full rounded-lg" />
        </div>

        {/* Related Sets skeleton */}
        <Skeleton className="h-px w-full" />
        <div>
          <Skeleton className="mb-4 h-8 w-36" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SetCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
