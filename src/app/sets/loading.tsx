import { CatalogGridSkeleton } from "@/components/catalog/catalog-skeleton";

export default function SetsLoading() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 pb-24 pt-10 sm:px-10 lg:px-14">
      <div className="h-10 w-72 animate-pulse rounded bg-bg-overlay" />
      <div className="mt-4 h-5 w-80 animate-pulse rounded bg-bg-overlay" />
      <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden space-y-4 lg:block">
          <div className="h-96 animate-pulse rounded-2xl bg-bg-overlay" />
        </aside>
        <div className="space-y-6">
          <div className="h-10 w-full animate-pulse rounded bg-bg-overlay" />
          <CatalogGridSkeleton />
        </div>
      </div>
    </div>
  );
}
