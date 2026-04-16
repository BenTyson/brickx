"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type ScrollRevealProps = HTMLMotionProps<"div"> & {
  /** 'up' slides from below, 'down' from above, 'left'/'right' horizontal */
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  delay?: number;
  duration?: number;
  /** How much of the element must be visible to trigger (0–1) */
  amount?: number;
  /** Only fire once */
  once?: boolean;
};

const offsets = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
};

/**
 * Viewport-triggered reveal. Heavier than <SlideUp> — use for section
 * entries further down the page; <SlideUp> for above-the-fold.
 */
export const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(
  (
    {
      direction = "up",
      distance,
      delay = 0,
      duration = 0.7,
      amount = 0.2,
      once = true,
      children,
      ...props
    },
    ref,
  ) => {
    const base = offsets[direction];
    const offset = {
      x: base.x ? (base.x / 32) * (distance ?? 32) : 0,
      y: base.y ? (base.y / 32) * (distance ?? 32) : 0,
    };
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, ...offset }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once, amount }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
ScrollReveal.displayName = "ScrollReveal";
