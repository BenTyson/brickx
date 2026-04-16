import {
  CountUp,
  FadeIn,
  ScrollReveal,
  SlideUp,
  StaggerChildren,
} from "@/components/motion";

export default function TokensPage() {
  return (
    <main className="bg-spotlight bg-noise relative min-h-screen">
      <div className="relative z-10 mx-auto max-w-[1100px] px-6 py-24 sm:px-10 lg:px-14 lg:py-32">
        {/* ── Editorial hero ─────────────────────────────── */}
        <FadeIn className="mb-28">
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            D1 · Foundation · v2
          </div>
          <h1 className="text-display font-serif-display mt-6 text-text-primary">
            LEGO as an <em>asset class.</em>
          </h1>
          <p className="text-body mt-8 max-w-[560px] text-text-secondary">
            Design substrate for BrickX. Electric ultramarine on warm-black
            surfaces, Instrument Serif for editorial moments, Geist Sans for
            UI, Geist Mono for every figure. Hairline borders, generous air,
            motion used sparingly.
          </p>
        </FadeIn>

        {/* ── The signature moment ──────────────────────── */}
        <SlideUp className="mb-28" delay={0.1}>
          <div className="text-micro font-mono font-tabular text-text-tertiary mb-8">
            The signature moment
          </div>
          <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <div className="text-small text-text-tertiary">
                Total market value
              </div>
              <div className="text-display-sm font-mono font-tabular mt-2 text-text-primary">
                $
                <CountUp value={12480} />
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_oklab,var(--success)_14%,transparent)] px-3 py-1">
                <span className="text-small font-mono font-tabular text-success">
                  +
                  <CountUp value={11.11} decimals={2} suffix="%" />
                </span>
                <span className="text-micro text-success/70">past 90 days</span>
              </div>
            </div>
            <blockquote className="font-serif-display text-h2 max-w-[420px] text-balance text-text-primary italic">
              &ldquo;Retired modulars outperformed the S&amp;P over the last
              decade.&rdquo;
            </blockquote>
          </div>
        </SlideUp>

        {/* ── Surfaces ──────────────────────────────────── */}
        <Section index="01" title="Surfaces — warm-black elevation triad">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SurfaceSwatch
              name="bg-base"
              hex="#0B0A0C"
              className="bg-bg-base"
            />
            <SurfaceSwatch
              name="bg-raised"
              hex="#161418"
              className="bg-bg-raised"
            />
            <SurfaceSwatch
              name="bg-overlay"
              hex="#1E1B22"
              className="bg-bg-overlay"
            />
          </div>
          <p className="text-small text-text-tertiary mt-6 max-w-[640px]">
            Microscopic violet-red undertone separates these from pure neutral
            darks. Reads as leather or aged paper rather than Chrome.
          </p>
        </Section>

        {/* ── Accent + Semantic ─────────────────────────── */}
        <Section index="02" title="Accent & semantic signal">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ColorChip name="accent" hex="#4C6FFF" className="bg-accent" />
            <ColorChip
              name="accent-hover"
              hex="#6C88FF"
              className="bg-accent-hover"
            />
            <ColorChip name="success" hex="#22C55E" className="bg-success" />
            <ColorChip name="danger" hex="#EF4444" className="bg-danger" />
            <ColorChip name="warning" hex="#F59E0B" className="bg-warning" />
            <ColorChip name="info" hex="#8B5CF6" className="bg-info" />
            <ColorChip
              name="border-thin"
              hex="rgba(255,255,255,0.05)"
              className="bg-border-thin"
            />
            <ColorChip
              name="border-emphasis"
              hex="rgba(255,255,255,0.09)"
              className="bg-border-emphasis"
            />
          </div>
          <p className="text-small text-text-tertiary mt-6 max-w-[640px]">
            One accent — electric ultramarine <code className="font-mono font-tabular">#4C6FFF</code>.
            Used sparingly on CTAs, active state, and chart primary series.
            Green/red as the only signal for gain/loss.
          </p>
        </Section>

        {/* ── Text tiers ────────────────────────────────── */}
        <Section index="03" title="Text opacity tiers">
          <div className="space-y-5">
            <p className="text-h3 text-text-primary">
              Primary — 100% · headlines &amp; key data
            </p>
            <p className="text-h3 text-text-secondary">
              Secondary — 72% · body copy
            </p>
            <p className="text-h3 text-text-tertiary">
              Tertiary — 48% · metadata, axis labels
            </p>
            <p className="text-h3 text-text-quaternary">
              Quaternary — 28% · disabled, placeholders
            </p>
          </div>
        </Section>

        {/* ── Typography pairing ────────────────────────── */}
        <Section
          index="04"
          title="Typography — editorial serif × UI sans × tabular mono"
        >
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-10">
              <TypeRow label="display serif / 120" meta="Instrument Serif · editorial">
                <span className="text-display font-serif-display block">
                  11.2%
                </span>
              </TypeRow>
              <TypeRow label="h1 serif / 56" meta="Instrument Serif · hero">
                <span className="text-h1 font-serif-display block">
                  LEGO as an <em>asset class.</em>
                </span>
              </TypeRow>
              <TypeRow label="h2 sans / 40" meta="Geist Sans · section lead">
                <span className="text-h2 block">
                  Retired modulars outperformed the S&amp;P
                </span>
              </TypeRow>
              <TypeRow label="h3 sans / 28" meta="Geist Sans">
                <span className="text-h3 block">Star Wars Heat Index</span>
              </TypeRow>
              <TypeRow label="body / 15" meta="Geist Sans">
                <span className="text-body block">
                  Track LEGO set values, build your portfolio, and make smarter
                  investment decisions across 26,000+ sets.
                </span>
              </TypeRow>
              <TypeRow label="small / 13" meta="Geist Sans · metadata">
                <span className="text-small text-text-secondary block">
                  Retired · 2018 · 4,124 pieces · 10 minifigs
                </span>
              </TypeRow>
              <TypeRow label="micro / 11" meta="Geist Mono · labels">
                <span className="text-micro font-mono font-tabular text-text-tertiary block">
                  Updated 4m ago
                </span>
              </TypeRow>
            </div>

            <div className="space-y-6 sm:sticky sm:top-10 sm:self-start">
              <div>
                <div className="text-micro font-mono font-tabular text-text-tertiary">
                  Proportional · never align
                </div>
                <div className="text-h1 mt-3 text-text-primary">
                  $1,247.38
                </div>
                <div className="text-h3 mt-1 text-danger">−11.11%</div>
              </div>
              <hr className="border-border-thin" />
              <div>
                <div className="text-micro font-mono font-tabular text-text-tertiary">
                  Geist Mono + tabular · every figure
                </div>
                <div className="text-h1 font-mono font-tabular mt-3 text-text-primary">
                  $1,247.38
                </div>
                <div className="text-h3 font-mono font-tabular mt-1 text-success">
                  +11.11%
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Surface textures ─────────────────────────── */}
        <Section index="05" title="Surface textures">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SurfaceDemo className="bg-spotlight bg-noise border border-border-thin">
              <div className="text-micro font-mono font-tabular text-text-tertiary">
                .bg-spotlight + .bg-noise
              </div>
              <div className="text-h3 font-serif-display mt-3 text-text-primary">
                Editorial surface
              </div>
            </SurfaceDemo>
            <SurfaceDemo className="bg-brand-gradient">
              <div className="text-micro font-mono font-tabular text-white/70">
                .bg-brand-gradient
              </div>
              <div className="text-h3 mt-3 text-white">Primary CTA</div>
            </SurfaceDemo>
            <SurfaceDemo>
              <div className="flex items-center gap-3">
                <span className="bg-conic-brand inline-block h-3 w-3 rounded-full" />
                <span className="text-small text-text-secondary">
                  .bg-conic-brand — accent micro-chip
                </span>
              </div>
              <div className="glow-accent mt-6 rounded-md p-4">
                <span className="text-small text-text-primary">
                  .glow-accent — active state aura
                </span>
              </div>
            </SurfaceDemo>
            <SurfaceDemo>
              <div className="text-micro font-mono font-tabular text-text-tertiary">
                .skeleton-shimmer
              </div>
              <div className="skeleton-shimmer mt-4 h-4 w-3/4 rounded" />
              <div className="skeleton-shimmer mt-2 h-4 w-1/2 rounded" />
              <div className="skeleton-shimmer mt-2 h-4 w-2/3 rounded" />
            </SurfaceDemo>
          </div>
        </Section>

        {/* ── Motion primitives ─────────────────────────── */}
        <Section index="06" title="Motion primitives">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <MotionDemo label="<FadeIn>">
              <FadeIn>
                <div className="text-h3 text-text-primary">Faded in</div>
                <div className="text-small text-text-tertiary mt-2">
                  500ms · ease-out-expo
                </div>
              </FadeIn>
            </MotionDemo>

            <MotionDemo label="<SlideUp>">
              <SlideUp delay={0.1}>
                <div className="text-h3 text-text-primary">Slid up 24px</div>
                <div className="text-small text-text-tertiary mt-2">
                  600ms · 100ms delay
                </div>
              </SlideUp>
            </MotionDemo>

            <MotionDemo label="<CountUp>">
              <div className="text-h1 font-mono font-tabular text-text-primary">
                $
                <CountUp value={12480} decimals={0} />
              </div>
              <div className="text-h3 font-mono font-tabular text-success mt-2">
                +
                <CountUp value={11.11} decimals={2} suffix="%" />
              </div>
            </MotionDemo>

            <MotionDemo label="<StaggerChildren>">
              <StaggerChildren className="space-y-2" stagger={0.08}>
                {[
                  { name: "Millennium Falcon", delta: 2.34 },
                  { name: "Hogwarts Castle", delta: 1.12 },
                  { name: "Imperial Flagship", delta: 4.78 },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between py-1.5"
                  >
                    <span className="text-small text-text-primary">
                      {row.name}
                    </span>
                    <span className="text-small font-mono font-tabular text-success">
                      +{row.delta.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </StaggerChildren>
            </MotionDemo>
          </div>

          <div className="mt-3">
            <MotionDemo label="<ScrollReveal>" tall>
              <div className="text-small text-text-tertiary mb-12">
                Scroll so this enters the viewport →
              </div>
              <ScrollReveal>
                <div className="rounded-lg bg-bg-overlay p-6">
                  <div className="text-h3 font-serif-display text-text-primary">
                    Revealed on scroll.
                  </div>
                  <div className="text-small text-text-secondary mt-3">
                    Triggers once when 20% visible.
                  </div>
                </div>
              </ScrollReveal>
            </MotionDemo>
          </div>
        </Section>

        {/* ── Closing line ──────────────────────────────── */}
        <div className="mt-32 max-w-[640px]">
          <div className="text-micro font-mono font-tabular text-text-tertiary">
            End of gallery
          </div>
          <p className="text-h3 font-serif-display mt-4 text-text-primary">
            Restraint is the luxury.
          </p>
          <p className="text-small text-text-tertiary mt-3">
            /demo/tokens · not indexed · BrickX · D1 v2
          </p>
        </div>
      </div>
    </main>
  );
}

/* ─── Local building blocks ─────────────────────────── */

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-24">
      <div className="mb-8 flex items-baseline gap-5">
        <span className="text-micro font-mono font-tabular text-text-quaternary">
          {index}
        </span>
        <h2 className="text-h3 text-text-primary">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SurfaceSwatch({
  name,
  hex,
  className,
}: {
  name: string;
  hex: string;
  className?: string;
}) {
  return (
    <div className={`rounded-lg p-6 ${className ?? ""}`}>
      <div className="text-small text-text-primary">{name}</div>
      <div className="text-micro font-mono font-tabular text-text-tertiary mt-1">
        {hex}
      </div>
      <div className="mt-20 h-0" />
    </div>
  );
}

function ColorChip({
  name,
  hex,
  className,
}: {
  name: string;
  hex: string;
  className?: string;
}) {
  return (
    <div>
      <div className={`h-16 rounded-md ${className ?? ""}`} />
      <div className="mt-3">
        <div className="text-small text-text-primary">{name}</div>
        <div className="text-micro font-mono font-tabular text-text-tertiary mt-0.5">
          {hex}
        </div>
      </div>
    </div>
  );
}

function TypeRow({
  label,
  meta,
  children,
}: {
  label: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-10">
      <div className="shrink-0 sm:w-40 sm:pt-3">
        <div className="text-micro font-mono font-tabular text-text-tertiary">
          {label}
        </div>
        {meta ? (
          <div className="text-micro text-text-quaternary mt-1 normal-case">
            {meta}
          </div>
        ) : null}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function SurfaceDemo({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative min-h-[180px] overflow-hidden rounded-lg bg-bg-raised p-8 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function MotionDemo({
  label,
  tall,
  children,
}: {
  label: string;
  tall?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-lg bg-bg-raised p-6 ${tall ? "min-h-[300px]" : ""}`}
    >
      <div className="text-micro font-mono font-tabular text-text-tertiary mb-6">
        {label}
      </div>
      {children}
    </div>
  );
}
