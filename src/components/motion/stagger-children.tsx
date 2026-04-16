"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { Children, forwardRef, type ReactNode } from "react";

type StaggerChildrenProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  /** Delay between each child (seconds) */
  stagger?: number;
  /** Delay before first child starts (seconds) */
  delayStart?: number;
  /** Per-child distance (slide up) */
  distance?: number;
  /** Per-child duration */
  duration?: number;
};

/**
 * Staggered slide-up for grid/list entries. Wraps each immediate child
 * in a motion.div so you don't need to make leaves motion-aware.
 */
export const StaggerChildren = forwardRef<HTMLDivElement, StaggerChildrenProps>(
  (
    {
      children,
      stagger = 0.06,
      delayStart = 0,
      distance = 16,
      duration = 0.5,
      ...props
    },
    ref,
  ) => {
    const items = Children.toArray(children);
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: stagger,
              delayChildren: delayStart,
            },
          },
        }}
        {...props}
      >
        {items.map((child, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: distance },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  },
);
StaggerChildren.displayName = "StaggerChildren";
