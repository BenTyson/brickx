"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils/cn";
import {
  themeColor,
  type Holding,
} from "@/lib/mock/portfolio";

interface AllocationTreemapProps {
  holdings: Holding[];
  className?: string;
}

interface Tile {
  id: string;
  name: string;
  themeSlug: string;
  value: number;
  gainPct: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Squarified treemap — Bruls/Huijbregts/van Wijk. */
function squarify(
  items: { id: string; value: number; name: string; themeSlug: string; gainPct: number }[],
  x: number,
  y: number,
  w: number,
  h: number,
): Tile[] {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((a, b) => a + b.value, 0);
  if (total <= 0 || sorted.length === 0) return [];
  const tiles: Tile[] = [];
  type SizedItem = (typeof items)[number] & { size: number };
  layout(sorted.map((s) => ({ ...s, size: (s.value / total) * w * h })));
  return tiles;

  function layout(queue: SizedItem[]) {
    let bx = x;
    let by = y;
    let bw = w;
    let bh = h;
    let row: SizedItem[] = [];
    let items = [...queue];

    function worst(row: SizedItem[], length: number): number {
      if (row.length === 0) return Infinity;
      const sum = row.reduce((a, r) => a + r.size, 0);
      const rmax = Math.max(...row.map((r) => r.size));
      const rmin = Math.min(...row.map((r) => r.size));
      const l2 = length * length;
      const s2 = sum * sum;
      return Math.max((l2 * rmax) / s2, s2 / (l2 * rmin));
    }

    while (items.length > 0) {
      const shortest = Math.min(bw, bh);
      const next = items[0];
      const newRow = [...row, next];
      if (worst(newRow, shortest) <= worst(row, shortest) || row.length === 0) {
        row = newRow;
        items = items.slice(1);
      } else {
        place(row, shortest);
        row = [];
      }
    }
    if (row.length > 0) place(row, Math.min(bw, bh));

    function place(row: SizedItem[], length: number) {
      const sum = row.reduce((a, r) => a + r.size, 0);
      const thickness = sum / length;
      if (bw >= bh) {
        let cy = by;
        for (const r of row) {
          const rh = r.size / thickness;
          tiles.push({
            id: r.id,
            name: r.name,
            themeSlug: r.themeSlug,
            value: r.value,
            gainPct: r.gainPct,
            x: bx,
            y: cy,
            w: thickness,
            h: rh,
          });
          cy += rh;
        }
        bx += thickness;
        bw -= thickness;
      } else {
        let cx = bx;
        for (const r of row) {
          const rw = r.size / thickness;
          tiles.push({
            id: r.id,
            name: r.name,
            themeSlug: r.themeSlug,
            value: r.value,
            gainPct: r.gainPct,
            x: cx,
            y: by,
            w: rw,
            h: thickness,
          });
          cx += rw;
        }
        by += thickness;
        bh -= thickness;
      }
    }
  }
}

export function AllocationTreemap({ holdings, className }: AllocationTreemapProps) {
  const WIDTH = 720;
  const HEIGHT = 320;

  const tiles = useMemo(() => {
    const items = holdings.map((h) => {
      const value = h.set.currentValue * h.qty;
      const gainPct =
        ((h.set.currentValue - h.costBasisPerUnit) /
          Math.max(h.costBasisPerUnit, 1)) *
        100;
      return {
        id: h.set.id,
        name: h.set.name,
        themeSlug: h.set.themeSlug,
        value,
        gainPct,
      };
    });
    return squarify(items, 0, 0, WIDTH, HEIGHT);
  }, [holdings]);

  return (
    <section
      className={cn(
        "rounded-2xl border border-border-thin bg-bg-raised p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            Value map
          </div>
          <div className="mt-1 font-serif-display text-[22px] leading-tight text-text-primary">
            Every set, sized by market value.
          </div>
        </div>
        <div className="text-micro font-mono font-tabular text-text-quaternary">
          color = theme · size = $
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border-thin bg-bg-base">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block h-auto w-full"
          role="img"
          aria-label="Portfolio treemap by set value"
        >
          {tiles.map((t) => {
            const showLabel = t.w > 58 && t.h > 30;
            const showValue = t.w > 90 && t.h > 52;
            const fill = themeColor(t.themeSlug);
            return (
              <g key={t.id}>
                <rect
                  x={t.x + 1}
                  y={t.y + 1}
                  width={Math.max(t.w - 2, 0)}
                  height={Math.max(t.h - 2, 0)}
                  rx={4}
                  fill={fill}
                  fillOpacity={0.18}
                  stroke={fill}
                  strokeOpacity={0.4}
                  strokeWidth={0.75}
                >
                  <title>
                    {t.name} — ${Math.round(t.value).toLocaleString()} ·{" "}
                    {t.gainPct >= 0 ? "+" : ""}
                    {t.gainPct.toFixed(1)}%
                  </title>
                </rect>
                {showLabel && (
                  <text
                    x={t.x + 10}
                    y={t.y + 18}
                    fontSize={t.w > 140 ? 12 : 10.5}
                    fontFamily="var(--font-sans)"
                    fill="var(--text-primary)"
                    style={{ pointerEvents: "none" }}
                  >
                    {truncate(t.name, t.w > 180 ? 28 : t.w > 130 ? 18 : 12)}
                  </text>
                )}
                {showValue && (
                  <text
                    x={t.x + 10}
                    y={t.y + 36}
                    fontSize={11}
                    fontFamily="var(--font-mono)"
                    fill="var(--text-secondary)"
                    style={{ fontVariantNumeric: "tabular-nums", pointerEvents: "none" }}
                  >
                    ${Math.round(t.value).toLocaleString()}
                  </text>
                )}
                {showValue && t.h > 72 && (
                  <text
                    x={t.x + 10}
                    y={t.y + 52}
                    fontSize={10}
                    fontFamily="var(--font-mono)"
                    fill={t.gainPct >= 0 ? "var(--success)" : "var(--danger)"}
                    style={{ fontVariantNumeric: "tabular-nums", pointerEvents: "none" }}
                  >
                    {t.gainPct >= 0 ? "+" : ""}
                    {t.gainPct.toFixed(1)}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

function truncate(s: string, n: number) {
  return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…";
}
