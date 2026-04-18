"use client";

import { motion } from "framer-motion";

interface CatalogEmptyProps {
  onClear: () => void;
}

/**
 * Illustrated empty state — three stacked bricks with a magnifier.
 * Uses only design tokens so it re-tones with the palette.
 */
export function CatalogEmpty({ onClear }: CatalogEmptyProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center gap-6 rounded-2xl border border-border-thin bg-card px-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <EmptyBricks />
      </motion.div>
      <div className="max-w-sm">
        <h2 className="text-h3 font-serif-display italic text-text-primary">
          Nothing here yet.
        </h2>
        <p className="mt-2 text-small text-text-secondary">
          No sets match every filter you&rsquo;ve applied. Widen the range or
          clear a chip to see more.
        </p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center gap-2 rounded-full border border-border-emphasis bg-bg-raised px-4 py-2 text-small text-text-primary transition hover:bg-bg-overlay"
      >
        Clear filters
      </button>
    </div>
  );
}

function EmptyBricks() {
  return (
    <svg
      width={112}
      height={112}
      viewBox="0 0 112 112"
      fill="none"
      aria-hidden
      className="opacity-80"
    >
      <defs>
        <linearGradient id="brick-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--bg-overlay)" />
          <stop offset="100%" stopColor="var(--bg-raised)" />
        </linearGradient>
      </defs>
      {/* back brick */}
      <rect
        x="18"
        y="30"
        width="56"
        height="18"
        rx="3"
        fill="url(#brick-grad)"
        stroke="var(--border-emphasis)"
      />
      <circle cx="30" cy="28" r="3" fill="var(--bg-overlay)" stroke="var(--border-emphasis)" />
      <circle cx="42" cy="28" r="3" fill="var(--bg-overlay)" stroke="var(--border-emphasis)" />
      <circle cx="54" cy="28" r="3" fill="var(--bg-overlay)" stroke="var(--border-emphasis)" />
      <circle cx="66" cy="28" r="3" fill="var(--bg-overlay)" stroke="var(--border-emphasis)" />

      {/* middle brick — accent */}
      <rect
        x="28"
        y="50"
        width="56"
        height="18"
        rx="3"
        fill="color-mix(in oklab, var(--accent) 22%, var(--bg-raised))"
        stroke="color-mix(in oklab, var(--accent) 35%, transparent)"
      />
      <circle cx="40" cy="48" r="3" fill="var(--accent)" opacity="0.7" />
      <circle cx="52" cy="48" r="3" fill="var(--accent)" opacity="0.7" />
      <circle cx="64" cy="48" r="3" fill="var(--accent)" opacity="0.7" />
      <circle cx="76" cy="48" r="3" fill="var(--accent)" opacity="0.7" />

      {/* front brick */}
      <rect
        x="20"
        y="70"
        width="56"
        height="18"
        rx="3"
        fill="url(#brick-grad)"
        stroke="var(--border-emphasis)"
      />
      <circle cx="32" cy="68" r="3" fill="var(--bg-overlay)" stroke="var(--border-emphasis)" />
      <circle cx="44" cy="68" r="3" fill="var(--bg-overlay)" stroke="var(--border-emphasis)" />
      <circle cx="56" cy="68" r="3" fill="var(--bg-overlay)" stroke="var(--border-emphasis)" />
      <circle cx="68" cy="68" r="3" fill="var(--bg-overlay)" stroke="var(--border-emphasis)" />

      {/* magnifier */}
      <circle
        cx="80"
        cy="34"
        r="12"
        fill="none"
        stroke="var(--text-tertiary)"
        strokeWidth="2"
      />
      <line
        x1="89"
        y1="43"
        x2="98"
        y2="52"
        stroke="var(--text-tertiary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
