"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  Compass,
  LineChart,
  Briefcase,
  Bell,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: "/sets", label: "Browse", icon: Compass, match: ["/sets", "/themes"] },
  { href: "/market", label: "Market", icon: LineChart, match: ["/market"] },
  {
    href: "/portfolio",
    label: "Portfolio",
    icon: Briefcase,
    match: ["/portfolio"],
  },
  {
    href: "/collections",
    label: "Collections",
    icon: LayoutGrid,
    match: ["/collections"],
  },
  { href: "/alerts", label: "Alerts", icon: Bell, match: ["/alerts"] },
] as const;

function isActive(pathname: string, matches: readonly string[]) {
  return matches.some((m) => pathname === m || pathname.startsWith(`${m}/`));
}

export function MobileBottomNav() {
  const pathname = usePathname() ?? "/";
  const reduceMotion = useReducedMotion();

  return (
    <nav
      aria-label="Primary mobile navigation"
      className={cn(
        "md:hidden",
        "fixed inset-x-0 bottom-0 z-40",
        "pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-md items-stretch justify-around",
          "mx-3 mb-3 rounded-2xl border border-border-emphasis",
          "bg-bg-raised/80 backdrop-blur-xl supports-[backdrop-filter]:bg-bg-raised/65",
          "shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)]",
        )}
      >
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.match);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              aria-label={tab.label}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-1 px-1 py-2.5 min-h-12",
                "text-[10px] tracking-tight uppercase font-medium",
                "transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-xl",
                active ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              {active && (
                <motion.span
                  layoutId="mobile-tab-pill"
                  aria-hidden
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 34 }
                  }
                  className="absolute inset-x-2 inset-y-1 rounded-xl bg-bg-overlay"
                  style={{
                    boxShadow:
                      "inset 0 0 0 1px var(--border-emphasis), 0 0 18px -6px color-mix(in oklab, var(--accent) 60%, transparent)",
                  }}
                />
              )}
              <span className="relative z-[1] flex flex-col items-center gap-0.5">
                <Icon
                  className={cn(
                    "size-[18px] transition-colors",
                    active && "text-accent",
                  )}
                  strokeWidth={active ? 2.25 : 1.75}
                  aria-hidden
                />
                <span className="leading-none">{tab.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
