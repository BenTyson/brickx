import { cn } from "@/lib/utils/cn";

interface SkeletonProps extends React.ComponentProps<"div"> {
  variant?: "pulse" | "shimmer";
}

function Skeleton({
  className,
  variant = "shimmer",
  ...props
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "rounded-md",
        variant === "pulse" && "bg-bg-overlay/60 animate-pulse",
        variant === "shimmer" && "skeleton-shimmer",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
