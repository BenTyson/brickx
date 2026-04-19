"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (next: [number, number]) => void;
  onCommit?: (next: [number, number]) => void;
  format?: (n: number) => string;
  className?: string;
  ariaLabelLow?: string;
  ariaLabelHigh?: string;
}

/**
 * Dual-thumb range slider. Pure uncontrolled interaction over a
 * single track; commits on pointer-up to avoid over-firing URL writes.
 */
export function DualRangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  onCommit,
  format = (n) => String(n),
  className,
  ariaLabelLow = "Minimum",
  ariaLabelHigh = "Maximum",
}: DualRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"low" | "high" | null>(null);

  const [lo, hi] = value;
  const span = max - min;

  const pct = useCallback(
    (v: number) => ((v - min) / span) * 100,
    [min, span],
  );

  const onPointerDown = (which: "low" | "high") => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDragging(which);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const raw = min + ratio * span;
    const stepped = Math.round(raw / step) * step;
    if (dragging === "low") {
      const nextLo = Math.min(stepped, hi - step);
      if (nextLo !== lo) onChange([clamp(nextLo, min, max), hi]);
    } else {
      const nextHi = Math.max(stepped, lo + step);
      if (nextHi !== hi) onChange([lo, clamp(nextHi, min, max)]);
    }
  };

  const onPointerUp = () => {
    if (dragging) {
      setDragging(null);
      onCommit?.([lo, hi]);
    }
  };

  const lowPct = useMemo(() => pct(lo), [pct, lo]);
  const highPct = useMemo(() => pct(hi), [pct, hi]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        ref={trackRef}
        className="relative h-8 select-none"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-bg-overlay" />
        <div
          className="absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-accent"
          style={{
            left: `${lowPct}%`,
            width: `${Math.max(0, highPct - lowPct)}%`,
          }}
        />
        <Thumb
          ariaLabel={ariaLabelLow}
          value={lo}
          min={min}
          max={hi - step}
          step={step}
          pct={lowPct}
          active={dragging === "low"}
          onPointerDown={onPointerDown("low")}
          onKeyDown={(delta) => {
            const nextLo = clamp(lo + delta, min, hi - step);
            if (nextLo !== lo) {
              onChange([nextLo, hi]);
              onCommit?.([nextLo, hi]);
            }
          }}
        />
        <Thumb
          ariaLabel={ariaLabelHigh}
          value={hi}
          min={lo + step}
          max={max}
          step={step}
          pct={highPct}
          active={dragging === "high"}
          onPointerDown={onPointerDown("high")}
          onKeyDown={(delta) => {
            const nextHi = clamp(hi + delta, lo + step, max);
            if (nextHi !== hi) {
              onChange([lo, nextHi]);
              onCommit?.([lo, nextHi]);
            }
          }}
        />
      </div>
      <div className="flex items-center justify-between text-micro font-mono font-tabular text-text-tertiary">
        <span>{format(lo)}</span>
        <span>{format(hi)}</span>
      </div>
    </div>
  );
}

function Thumb({
  pct,
  active,
  onPointerDown,
  onKeyDown,
  ariaLabel,
  value,
  min,
  max,
  step,
}: {
  pct: number;
  active: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onKeyDown: (delta: number) => void;
  ariaLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <button
      type="button"
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onPointerDown={onPointerDown}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          onKeyDown(-step);
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          onKeyDown(step);
        }
      }}
      style={{ left: `${pct}%` }}
      className={cn(
        "absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border-emphasis bg-bg-raised transition",
        "hover:border-accent hover:bg-accent",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        active && "border-accent bg-accent",
      )}
    />
  );
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}
