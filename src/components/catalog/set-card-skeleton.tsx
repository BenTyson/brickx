export function SetCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border-thin bg-card">
      <div className="skeleton-shimmer aspect-[4/3] w-full" />
      <div className="flex flex-col gap-3 p-4">
        <span className="skeleton-shimmer h-3 w-12 rounded-sm" />
        <span className="skeleton-shimmer h-4 w-[75%] rounded-sm" />
        <span className="skeleton-shimmer h-3 w-[40%] rounded-sm" />
        <div className="mt-3 flex items-center justify-between">
          <span className="skeleton-shimmer h-3 w-16 rounded-sm" />
          <span className="skeleton-shimmer h-4 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}
