"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface CrossfadeProps {
  /** Truthy → render children. Falsy → render skeleton. Treated as the key. */
  ready: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Skeleton → content crossfade. Mount the skeleton first, swap to children
 * when ready. Uses AnimatePresence mode="popLayout" so the incoming element
 * takes space immediately while the outgoing fades.
 */
export function Crossfade({
  ready,
  skeleton,
  children,
  className,
}: CrossfadeProps) {
  const reduceMotion = useReducedMotion();
  const dur = reduceMotion ? 0.1 : 0.35;
  return (
    <div className={className}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={ready ? "content" : "skeleton"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur, ease: [0.16, 1, 0.3, 1] }}
        >
          {ready ? children : skeleton}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
