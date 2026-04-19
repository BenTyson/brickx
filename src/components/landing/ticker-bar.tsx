"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export type TickerItem = {
  id: string;
  name: string;
  delta: number;
};

interface TickerBarProps {
  items: TickerItem[];
  className?: string;
}

/**
 * Infinite horizontal ticker — duplicates items once to create a seamless
 * loop under translateX. Uses framer-motion repeat:Infinity for reduced-motion
 * respect (disables via prefers-reduced-motion automatically).
 */
export function TickerBar({ items, className }: TickerBarProps) {
  const doubled = [...items, ...items];
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border-y border-border-thin bg-bg-raised/60 py-3",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg-base to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg-base to-transparent"
        aria-hidden
      />
      <motion.div
        className="flex gap-10 whitespace-nowrap will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 48,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {doubled.map((item, i) => {
          const positive = item.delta >= 0;
          return (
            <span
              key={`${item.id}-${i}`}
              className="text-micro font-mono font-tabular inline-flex items-center gap-2 text-text-tertiary"
            >
              <span className="text-text-secondary">{item.name}</span>
              <span
                className={cn(
                  "tabular-nums",
                  positive ? "text-success" : "text-danger",
                )}
              >
                {positive ? "+" : ""}
                {item.delta.toFixed(2)}%
              </span>
              <span aria-hidden className="text-text-quaternary">
                ·
              </span>
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}
