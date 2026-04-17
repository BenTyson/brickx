"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/motion";

export function FinalCTA() {
  return (
    <section className="bg-noise relative overflow-hidden border-y border-border-thin">
      <div
        aria-hidden
        className="absolute inset-0 opacity-80 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent_75%)]"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, color-mix(in oklab, var(--accent) 26%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-6 py-28 text-center sm:px-10 lg:px-14 lg:py-40">
        <ScrollReveal>
          <p className="mx-auto max-w-[820px] text-display-sm font-serif-display italic text-text-primary">
            &ldquo;LEGO as an asset class.&rdquo;
          </p>
          <p className="mt-8 text-small font-mono font-tabular uppercase tracking-[0.12em] text-text-tertiary">
            — The thesis in four words
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/demo/components"
              className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-body font-medium text-accent-foreground shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--accent)_60%,transparent)] transition hover:brightness-110"
            >
              Start your portfolio
              <ArrowUpRight className="size-4" strokeWidth={2.4} />
            </Link>
            <Link
              href="/demo/tokens"
              className="inline-flex items-center gap-2 rounded-full border border-border-emphasis bg-bg-raised/80 px-6 py-3.5 text-body text-text-secondary transition hover:bg-bg-overlay hover:text-text-primary"
            >
              See the system
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
