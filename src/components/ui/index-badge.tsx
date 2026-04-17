import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type IndexTone = "brand" | "warm" | "cool" | "neutral";

interface IndexBadgeProps {
  /** Displayed name, e.g. "BrickX 100". */
  name: string;
  /** Optional slug for linking to the index page. */
  slug?: string;
  /** Tone variant. Default "brand" (ultramarine). */
  tone?: IndexTone;
  /** Optional short figure (e.g. delta or weight) shown after the name. */
  figure?: string;
  size?: "sm" | "md";
  className?: string;
}

const toneStyles: Record<IndexTone, string> = {
  brand:
    "bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-accent ring-1 ring-inset ring-[color-mix(in_oklab,var(--accent)_26%,transparent)]",
  warm:
    "bg-[color-mix(in_oklab,var(--warning)_14%,transparent)] text-warning ring-1 ring-inset ring-[color-mix(in_oklab,var(--warning)_26%,transparent)]",
  cool:
    "bg-[color-mix(in_oklab,var(--info)_14%,transparent)] text-info ring-1 ring-inset ring-[color-mix(in_oklab,var(--info)_26%,transparent)]",
  neutral:
    "bg-bg-overlay text-text-secondary ring-1 ring-inset ring-border-thin",
};

/**
 * Compact pill marking index membership — BrickX 100, Star Wars Heat Index etc.
 * Renders as a link when `slug` is provided, else a span.
 */
export function IndexBadge({
  name,
  slug,
  tone = "brand",
  figure,
  size = "md",
  className,
}: IndexBadgeProps) {
  const sizeClass =
    size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5";

  const body = (
    <>
      <span className="inline-flex size-1.5 rounded-full bg-current" />
      <span className="font-medium">{name}</span>
      {figure && (
        <span className="ml-1 font-mono font-tabular tabular-nums opacity-80">
          {figure}
        </span>
      )}
    </>
  );

  const classes = cn(
    "inline-flex items-center gap-1.5 rounded-full uppercase tracking-[0.06em]",
    sizeClass,
    toneStyles[tone],
    className,
  );

  if (slug) {
    return (
      <Link
        href={`/market/indices/${slug}`}
        className={cn(classes, "transition hover:brightness-110")}
      >
        {body}
      </Link>
    );
  }

  return <span className={classes}>{body}</span>;
}
