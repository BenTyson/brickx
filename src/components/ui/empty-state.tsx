import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  illustration: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  /** Secondary CTA / ghost action. */
  secondaryAction?: React.ReactNode;
  className?: string;
  /** Visual density — "spacious" for page-level, "compact" for in-card. */
  size?: "spacious" | "compact";
}

export function EmptyState({
  illustration,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = "spacious",
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border-thin bg-bg-raised/50",
        size === "spacious"
          ? "px-6 py-14 sm:px-12 sm:py-20"
          : "px-6 py-10 sm:px-10 sm:py-14",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 65% 45% at 50% 0%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
        }}
      />
      <div className="relative z-[1] mx-auto flex max-w-md flex-col items-center text-center">
        <div aria-hidden>{illustration}</div>
        <h2
          className={cn(
            "mt-6 font-serif-display tracking-tight text-text-primary",
            size === "spacious"
              ? "text-[32px] leading-[1.05] sm:text-[40px]"
              : "text-[24px] leading-[1.1] sm:text-[28px]",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-sm text-small text-text-tertiary sm:text-body">
            {description}
          </p>
        )}
        {(action || secondaryAction) && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {action}
            {secondaryAction}
          </div>
        )}
      </div>
    </section>
  );
}
