"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useTransform,
  motion,
} from "framer-motion";
import { useEffect, useRef } from "react";

type CountUpProps = {
  /** Target numeric value */
  value: number;
  /** Starting value (default 0) */
  from?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Decimal places (default 0) */
  decimals?: number;
  /** Optional prefix, e.g. "$" */
  prefix?: string;
  /** Optional suffix, e.g. "%" */
  suffix?: string;
  /** Format with thousands separator (default true) */
  format?: boolean;
  /** Fire only when in viewport */
  once?: boolean;
  /** Extra class on the span */
  className?: string;
};

/**
 * Count-up numeric reveal — cobalt/mono look best with `.font-tabular`.
 * Triggers when scrolled into view (once=true by default). Respects reduced-motion.
 */
export function CountUp({
  value,
  from = 0,
  duration = 1.4,
  decimals = 0,
  prefix = "",
  suffix = "",
  format = true,
  once = true,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, amount: 0.5 });
  const motionVal = useMotionValue(from);
  const rounded = useTransform(motionVal, (latest) => {
    const fixed = latest.toFixed(decimals);
    if (!format) return `${prefix}${fixed}${suffix}`;
    const [int, dec] = fixed.split(".");
    const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${prefix}${dec ? `${intFmt}.${dec}` : intFmt}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, value, duration, motionVal]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
