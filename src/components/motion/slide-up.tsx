"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type SlideUpProps = HTMLMotionProps<"div"> & {
  delay?: number;
  duration?: number;
  distance?: number;
};

/**
 * Slides up + fades in. Use for stat cards, section reveals, list items.
 */
export const SlideUp = forwardRef<HTMLDivElement, SlideUpProps>(
  (
    { delay = 0, duration = 0.6, distance = 24, children, ...props },
    ref,
  ) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: distance }}
        animate={{ opacity: 1, y: 0 }}
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
SlideUp.displayName = "SlideUp";
