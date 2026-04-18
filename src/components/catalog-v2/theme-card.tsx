"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Sparkline } from "@/components/charts/sparkline";
import { DeltaChip } from "@/components/ui/delta-chip";
import { IndexBadge } from "@/components/ui/index-badge";
import { themeIndexSeries, type Theme } from "@/lib/mock/catalog";
import { cn } from "@/lib/utils/cn";

interface ThemeCardProps {
  theme: Theme;
  emphasis?: boolean;
  href?: string;
}

/**
 * Theme card — mini index tile. Pinned themes render with `emphasis` for
 * larger type + a fuller sparkline.
 */
export function ThemeCard({ theme, emphasis, href }: ThemeCardProps) {
  const series = themeIndexSeries(theme);
  const indexValue = series[series.length - 1].v;

  const body = (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-6 transition",
        emphasis
          ? "border-border-emphasis"
          : "border-border-thin hover:border-border-emphasis",
      )}
    >
      {emphasis && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_80%_60%_at_20%_0%,black,transparent_70%)]"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 70%)",
          }}
        />
      )}

      <header className="relative flex items-center justify-between gap-3">
        <IndexBadge name={theme.name} tone={theme.tone} size={emphasis ? "md" : "sm"} />
        <ArrowUpRight className="size-4 text-text-quaternary transition group-hover:text-text-primary" />
      </header>

      <div className="relative mt-5 flex items-baseline gap-3">
        <span
          className={cn(
            "font-mono font-tabular tabular-nums text-text-primary",
            emphasis ? "text-[40px] tracking-tight" : "text-2xl",
          )}
        >
          {indexValue.toFixed(2)}
        </span>
        <DeltaChip value={theme.avgAppreciation} size={emphasis ? "md" : "sm"} hideIcon />
      </div>

      <p
        className={cn(
          "relative mt-4 text-text-secondary",
          emphasis ? "text-body max-w-[380px]" : "text-small line-clamp-2",
        )}
      >
        {theme.tagline}
      </p>

      <div className="relative mt-6">
        <Sparkline
          data={series}
          width={emphasis ? 520 : 280}
          height={emphasis ? 72 : 36}
          strokeWidth={emphasis ? 1.5 : 1.25}
          tone={theme.tone === "warm" ? "accent" : "auto"}
          className="w-full"
          showEndDot={emphasis}
        />
      </div>

      <footer className="relative mt-6 flex items-center justify-between text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
        <span>{theme.setCount} sets</span>
        <span>Avg +{theme.avgAppreciation.toFixed(1)}%</span>
      </footer>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {body}
      </Link>
    );
  }
  return body;
}
