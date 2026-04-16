"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
  duration?: number;
};

/**
 * Opacity fade-in on mount. Use for hero content, cards, sections.
 * Respects reduced-motion (framer-motion handles this when transition uses default).
 */
export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ delay = 0, duration = 0.5, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
FadeIn.displayName = "FadeIn";
