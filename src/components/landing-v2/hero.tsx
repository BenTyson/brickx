"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn, SlideUp } from "@/components/motion";
import { IndexBadge } from "@/components/ui/index-badge";

/**
 * Editorial hero — oversized serif headline with inline stat, noise-over-radial
 * backdrop, two CTAs, eyebrow index badges.
 */
export function Hero() {
  return (
    <section className="bg-noise bg-spotlight relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 -top-40 h-[520px] opacity-70 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent_70%)]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, color-mix(in oklab, var(--accent) 28%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-6 pb-24 pt-24 sm:px-10 lg:px-14 lg:pt-36">
        <FadeIn>
          <div className="flex items-center gap-3">
            <IndexBadge name="BrickX 100" tone="brand" figure="+2.3%" />
            <span className="text-micro font-mono font-tabular text-text-tertiary">
              Live · market open
            </span>
          </div>
        </FadeIn>

        <SlideUp delay={0.08} className="mt-10 max-w-[980px]">
          <h1 className="text-display-sm font-serif-display text-text-primary lg:text-display">
            LEGO has returned{" "}
            <em className="italic text-accent">~11% annually</em> since 2000.
          </h1>
        </SlideUp>

        <SlideUp delay={0.18}>
          <p className="mt-10 max-w-[580px] text-body text-text-secondary">
            BrickX treats LEGO sets as an asset class. Portfolio tracking,
            named indices, retirement intelligence, and a price engine that
            blends BrickLink, BrickOwl, and BrickEconomy — no spreadsheets, no
            guesswork.
          </p>
        </SlideUp>

        <SlideUp delay={0.28}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/demo/components"
              className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-small font-medium text-accent-foreground shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--accent)_60%,transparent)] transition hover:brightness-110"
            >
              Open a portfolio
              <ArrowUpRight className="size-4" strokeWidth={2.4} />
            </Link>
            <Link
              href="#why"
              className="inline-flex items-center gap-2 rounded-full border border-border-emphasis bg-bg-raised px-5 py-3 text-small text-text-secondary transition hover:bg-bg-overlay hover:text-text-primary"
            >
              How it works
            </Link>
            <span className="text-micro font-mono font-tabular text-text-quaternary">
              26,000+ sets tracked · no card required
            </span>
          </div>
        </SlideUp>
      </div>
    </section>
  );
}
