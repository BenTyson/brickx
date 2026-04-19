"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Package } from "lucide-react";
import Image from "next/image";
import { DeltaChip } from "@/components/ui/delta-chip";
import { IndexBadge } from "@/components/ui/index-badge";
import type { ThemeSummary } from "@/lib/queries/themes";
import { cn } from "@/lib/utils/cn";

interface ThemeCardProps {
  theme: ThemeSummary;
  emphasis?: boolean;
  href?: string;
}

export function ThemeCard({ theme, emphasis, href }: ThemeCardProps) {
  const hero = theme.heroSet;
  const delta = theme.avgAppreciation ?? 0;

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
        <IndexBadge
          name={theme.name}
          tone="brand"
          size={emphasis ? "md" : "sm"}
        />
        <ArrowUpRight className="size-4 text-text-quaternary transition group-hover:text-text-primary" />
      </header>

      <div className="relative mt-5 flex items-baseline gap-3">
        <span
          className={cn(
            "font-mono font-tabular tabular-nums text-text-primary",
            emphasis ? "text-[40px] tracking-tight" : "text-2xl",
          )}
        >
          {theme.setCount.toLocaleString()}
        </span>
        <span className="text-small text-text-tertiary">sets tracked</span>
        {theme.avgAppreciation != null && (
          <DeltaChip
            value={delta}
            size={emphasis ? "md" : "sm"}
            hideIcon
            suffix="yr"
          />
        )}
      </div>

      {hero && (
        <p
          className={cn(
            "relative mt-4 text-text-secondary",
            emphasis ? "text-body" : "text-small line-clamp-2",
          )}
        >
          Top set: <span className="text-text-primary">{hero.name}</span>
          {hero.market_value_new != null && (
            <span className="ml-2 font-mono font-tabular tabular-nums text-text-tertiary">
              ${hero.market_value_new.toFixed(0)}
            </span>
          )}
        </p>
      )}

      {hero && (
        <div className="relative mt-6 flex items-center gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border-thin bg-bg-overlay">
            {hero.img_url ? (
              <Image
                src={hero.img_url}
                alt={hero.name}
                fill
                sizes="64px"
                className="object-contain p-1.5"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="size-6 text-text-quaternary" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-micro font-mono font-tabular text-text-tertiary">
              {hero.id} · {hero.year}
            </div>
            <div className="line-clamp-1 text-small text-text-primary">
              {hero.name}
            </div>
          </div>
        </div>
      )}

      <footer className="relative mt-6 flex items-center justify-between text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
        <span>{theme.setCount.toLocaleString()} sets</span>
        {theme.avgAppreciation != null && (
          <span>
            Avg {delta >= 0 ? "+" : ""}
            {delta.toFixed(1)}% / yr
          </span>
        )}
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
