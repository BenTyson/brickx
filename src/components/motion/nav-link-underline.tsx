"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface NavLinkUnderlineProps {
  href: string;
  active?: boolean;
  children: ReactNode;
  className?: string;
  /** Shared `layoutId` across sibling links so the underline slides between them. */
  layoutGroupId?: string;
}

/**
 * Top-nav link with a sliding underline. When the active link is inside the
 * same `layoutGroupId`, Framer Motion's layout animation carries the bar to
 * the new target. Respects reduced motion via layout={true} which becomes
 * non-animated automatically when users opt out.
 */
export const NavLinkUnderline = forwardRef<
  HTMLAnchorElement,
  NavLinkUnderlineProps
>(({ href, active, children, className, layoutGroupId = "nav-underline" }, ref) => {
  return (
    <Link
      ref={ref}
      href={href}
      className={cn(
        "relative inline-flex h-9 items-center text-sm font-medium transition-colors",
        active ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
        className,
      )}
    >
      {children}
      {active && (
        <motion.span
          layoutId={layoutGroupId}
          className="absolute inset-x-0 -bottom-px h-px bg-accent"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
});
NavLinkUnderline.displayName = "NavLinkUnderline";
