"use client";

import { useId, useMemo } from "react";
import { cn } from "@/lib/utils/cn";
import type { SeriesPoint } from "@/lib/mock/series";

type Tone = "accent" | "success" | "danger" | "muted" | "auto";

interface SparklineProps {
  data: SeriesPoint[] | number[];
  width?: number;
  height?: number;
  /** Pixels of extra vertical padding inside the SVG viewbox */
  padding?: number;
  strokeWidth?: number;
  /**
   * "auto" picks success/danger by first-vs-last delta.
   * "muted" uses --text-tertiary.
   */
  tone?: Tone;
  /** Render gradient area fill beneath line. Default true. */
  area?: boolean;
  /** Draw a small terminal dot at the latest point. Default true. */
  showEndDot?: boolean;
  className?: string;
  ariaLabel?: string;
}

const toneColor: Record<Exclude<Tone, "auto">, string> = {
  accent: "var(--accent)",
  success: "var(--success)",
  danger: "var(--danger)",
  muted: "var(--text-tertiary)",
};

function normalize(data: SparklineProps["data"]): number[] {
  if (data.length === 0) return [];
  if (typeof data[0] === "number") return data as number[];
  return (data as SeriesPoint[]).map((p) => p.v);
}

/**
 * Tiny SVG sparkline — monotone-cubic bezier curve, gradient area fill,
 * no axes, no ticks. Defaults sized to 70×20 to fit in data-table rows.
 */
export function Sparkline({
  data,
  width = 70,
  height = 20,
  padding = 2,
  strokeWidth = 1.25,
  tone = "auto",
  area = true,
  showEndDot = true,
  className,
  ariaLabel,
}: SparklineProps) {
  const gradientId = useId();
  const values = useMemo(() => normalize(data), [data]);

  const resolvedTone: Exclude<Tone, "auto"> = useMemo(() => {
    if (tone !== "auto") return tone;
    if (values.length < 2) return "muted";
    const first = values[0];
    const last = values[values.length - 1];
    if (last > first) return "success";
    if (last < first) return "danger";
    return "muted";
  }, [tone, values]);

  const color = toneColor[resolvedTone];

  const { path, areaPath, endX, endY } = useMemo(() => {
    if (values.length < 2) {
      return { path: "", areaPath: "", endX: 0, endY: 0 };
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const innerW = width;
    const innerH = height - padding * 2;
    const n = values.length;

    const points = values.map((v, i) => {
      const x = (i / (n - 1)) * innerW;
      const y = padding + innerH - ((v - min) / span) * innerH;
      return [x, y] as const;
    });

    // Monotone cubic interpolation for a natural curve without overshoot.
    // Fritsch–Carlson algorithm.
    const secants: number[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      secants.push(
        (points[i + 1][1] - points[i][1]) /
          Math.max(points[i + 1][0] - points[i][0], 1e-6),
      );
    }
    const tangents: number[] = new Array(points.length);
    tangents[0] = secants[0] ?? 0;
    tangents[points.length - 1] = secants[secants.length - 1] ?? 0;
    for (let i = 1; i < points.length - 1; i++) {
      const prev = secants[i - 1];
      const next = secants[i];
      if (prev * next <= 0) {
        tangents[i] = 0;
      } else {
        tangents[i] = (prev + next) / 2;
      }
    }
    for (let i = 0; i < secants.length; i++) {
      if (secants[i] === 0) {
        tangents[i] = 0;
        tangents[i + 1] = 0;
      } else {
        const a = tangents[i] / secants[i];
        const b = tangents[i + 1] / secants[i];
        const h = a * a + b * b;
        if (h > 9) {
          const tau = 3 / Math.sqrt(h);
          tangents[i] = tau * a * secants[i];
          tangents[i + 1] = tau * b * secants[i];
        }
      }
    }

    let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0] = points[i];
      const [x1, y1] = points[i + 1];
      const dx = (x1 - x0) / 3;
      const cp1x = x0 + dx;
      const cp1y = y0 + tangents[i] * dx;
      const cp2x = x1 - dx;
      const cp2y = y1 - tangents[i + 1] * dx;
      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${x1.toFixed(2)} ${y1.toFixed(2)}`;
    }

    const last = points[points.length - 1];
    const first = points[0];
    const areaD = `${d} L ${last[0].toFixed(2)} ${height} L ${first[0].toFixed(2)} ${height} Z`;

    return {
      path: d,
      areaPath: areaD,
      endX: last[0],
      endY: last[1],
    };
  }, [values, width, height, padding]);

  if (values.length < 2) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-block h-5 w-[70px] rounded bg-[var(--border-thin)]",
          className,
        )}
        style={{ width, height }}
      />
    );
  }

  return (
    <svg
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("inline-block overflow-visible", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {area && <path d={areaPath} fill={`url(#${gradientId})`} />}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showEndDot && (
        <circle
          cx={endX}
          cy={endY}
          r={1.6}
          fill={color}
          stroke="var(--bg-base)"
          strokeWidth={0.75}
        />
      )}
    </svg>
  );
}
