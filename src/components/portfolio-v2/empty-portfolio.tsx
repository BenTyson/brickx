import Link from "next/link";
import { ArrowRight, Plus, Upload } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface EmptyPortfolioProps {
  /** Where the primary "Add first set" action goes. */
  addHref?: string;
  /** Where the "Import CSV" action goes. */
  importHref?: string;
  className?: string;
}

export function EmptyPortfolio({
  addHref = "/demo/sets",
  importHref = "/onboarding/import",
  className,
}: EmptyPortfolioProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border-thin bg-bg-raised px-6 py-16 sm:px-16 sm:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-[2] mx-auto flex max-w-xl flex-col items-center text-center">
        <StackIllustration />

        <h1 className="mt-8 font-serif-display text-[44px] leading-[1.02] tracking-tight text-text-primary sm:text-[56px]">
          A collection, waiting.
        </h1>
        <p className="mt-4 max-w-md text-body text-text-secondary">
          Add your first set and watch it compound. Import a spreadsheet if you
          already keep one — BrickX will untangle it for you.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={addHref}
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-small text-accent-foreground transition hover:bg-accent-hover"
          >
            <Plus className="size-4" strokeWidth={2.25} aria-hidden />
            <span>Add your first set</span>
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2.25}
              aria-hidden
            />
          </Link>
          <Link
            href={importHref}
            className="inline-flex items-center gap-2 rounded-full border border-border-emphasis bg-bg-overlay px-5 py-2.5 text-small text-text-primary transition hover:border-text-quaternary"
          >
            <Upload className="size-4" strokeWidth={2.25} aria-hidden />
            Import CSV
          </Link>
        </div>

        <div className="mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { n: "26,095", l: "sets in the catalog" },
            { n: "11%", l: "avg annual return, 25y" },
            { n: "live", l: "market prices, 3 sources" },
          ].map((c) => (
            <div
              key={c.l}
              className="rounded-xl border border-border-thin bg-bg-overlay/40 px-4 py-3"
            >
              <div className="font-mono font-tabular text-xl tabular-nums text-text-primary">
                {c.n}
              </div>
              <div className="mt-1 text-micro font-mono font-tabular text-text-tertiary">
                {c.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StackIllustration() {
  // Isometric brick stack — simple inline SVG, brand-colored.
  return (
    <svg
      width="128"
      height="128"
      viewBox="0 0 128 128"
      aria-hidden
      className="text-accent"
    >
      <defs>
        <linearGradient id="brickTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--accent-hover)" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="brickSide" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--accent-pressed)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent-pressed)" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((i) => {
        const y = 70 - i * 18;
        return (
          <g key={i} transform={`translate(0, ${y})`} opacity={0.95 - i * 0.12}>
            <path
              d="M 24 18 L 64 4 L 104 18 L 64 32 Z"
              fill="url(#brickTop)"
              stroke="var(--accent)"
              strokeOpacity={0.5}
              strokeWidth={0.75}
            />
            <path
              d="M 24 18 L 24 30 L 64 44 L 64 32 Z"
              fill="url(#brickSide)"
              stroke="var(--accent-pressed)"
              strokeOpacity={0.6}
              strokeWidth={0.75}
            />
            <path
              d="M 104 18 L 104 30 L 64 44 L 64 32 Z"
              fill="var(--accent-pressed)"
              fillOpacity={0.4}
              stroke="var(--accent-pressed)"
              strokeOpacity={0.6}
              strokeWidth={0.75}
            />
            {/* Studs */}
            {[0, 1, 2].map((sx) => (
              <ellipse
                key={sx}
                cx={44 + sx * 20}
                cy={14 + (sx - 1) * 0.5}
                rx={4}
                ry={2.4}
                fill="var(--bg-base)"
                stroke="var(--accent)"
                strokeOpacity={0.55}
                strokeWidth={0.75}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
