import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DeltaChipProps {
  /** Change as a percentage (e.g. 4.27 for +4.27%). */
  value: number;
  /** Force tone; otherwise inferred from sign. */
  tone?: "success" | "danger" | "muted";
  /** Optional label after the figure, e.g. "30d". */
  suffix?: string;
  /** Hide the directional glyph for compact contexts. */
  hideIcon?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Pill showing a signed percentage change — green for gain, red for loss,
 * muted when flat. Pairs with tabular numerics.
 */
export function DeltaChip({
  value,
  tone,
  suffix,
  hideIcon,
  size = "md",
  className,
}: DeltaChipProps) {
  const resolvedTone: "success" | "danger" | "muted" =
    tone ?? (value > 0 ? "success" : value < 0 ? "danger" : "muted");
  const Icon =
    resolvedTone === "success"
      ? ArrowUpRight
      : resolvedTone === "danger"
        ? ArrowDownRight
        : Minus;
  const sign = value > 0 ? "+" : "";
  const formatted = `${sign}${value.toFixed(2)}%`;

  const toneClass =
    resolvedTone === "success"
      ? "bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-success"
      : resolvedTone === "danger"
        ? "bg-[color-mix(in_oklab,var(--danger)_14%,transparent)] text-danger"
        : "bg-bg-overlay text-text-tertiary";

  const sizeClass =
    size === "sm"
      ? "gap-0.5 px-1.5 py-0.5 text-[11px]"
      : "gap-1 px-2 py-0.5 text-[12px]";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-mono font-tabular tracking-tight tabular-nums",
        toneClass,
        sizeClass,
        className,
      )}
    >
      {!hideIcon && (
        <Icon
          className={cn(size === "sm" ? "size-3" : "size-3.5")}
          strokeWidth={2.25}
          aria-hidden="true"
        />
      )}
      <span>{formatted}</span>
      {suffix && (
        <span className="text-[0.85em] opacity-70">&nbsp;{suffix}</span>
      )}
    </span>
  );
}
