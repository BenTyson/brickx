"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type PressProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  /** Scale target while pressed. Default 0.98. */
  scale?: number;
  /** Render the press target with `display: contents`? Use when wrapping a
   * pre-styled button element directly — Press only contributes motion. */
  asChild?: boolean;
};

/**
 * Button-press feedback: scale 0.98 + spring release. Wrap any interactive
 * element to get tactile feedback without restyling it. Reduced-motion users
 * get no scale change. Composes with <button>, shadcn Button, or link-as-button.
 */
export const Press = forwardRef<HTMLButtonElement, PressProps>(
  ({ children, scale = 0.98, className, asChild, ...props }, ref) => {
    const reduceMotion = useReducedMotion();
    if (asChild) {
      return (
        <motion.span
          ref={ref as unknown as React.Ref<HTMLSpanElement>}
          whileTap={reduceMotion ? undefined : { scale }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className={cn("inline-flex", className)}
        >
          {children}
        </motion.span>
      );
    }
    return (
      <motion.button
        ref={ref}
        whileTap={reduceMotion ? undefined : { scale }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className={className}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);
Press.displayName = "Press";
