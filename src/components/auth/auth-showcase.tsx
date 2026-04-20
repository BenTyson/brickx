import { TrendingUp, ShieldCheck, Bell } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Live market values",
    body: "26,095 sets, three price sources, aggregated every hour.",
  },
  {
    icon: ShieldCheck,
    title: "Your vault, your rules",
    body: "Private by default. Exact purchase prices never leave your account unless you choose.",
  },
  {
    icon: Bell,
    title: "Wake up to the right price",
    body: "Target alerts fire the moment a set hits your number — not the next day.",
  },
];

export function AuthShowcase() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-bg-base p-10 xl:p-14">
      {/* Ambient gradient + noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 10%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 65%), radial-gradient(ellipse 60% 50% at 90% 90%, color-mix(in oklab, var(--info) 14%, transparent), transparent 60%), var(--bg-base)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          mixBlendMode: "overlay",
        }}
      />

      {/* Top editorial lede */}
      <div className="relative z-[1] max-w-xl">
        <div className="text-micro font-mono uppercase tracking-[0.25em] text-accent/80">
          BrickX — Market intelligence for LEGO
        </div>
        <h2 className="mt-6 font-serif-display text-[56px] leading-[1.02] tracking-tight text-text-primary xl:text-[72px]">
          LEGO as an <em className="italic">asset class.</em>
        </h2>
        <p className="mt-5 max-w-md text-body text-text-secondary">
          Track 26,000+ sets with live market pricing, portfolio analytics, and
          retirement alerts — the tools the hobby never had.
        </p>
      </div>

      {/* Feature bullets */}
      <div className="relative z-[1] mt-12 space-y-5">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-4">
            <div
              className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border-emphasis bg-bg-raised/60"
              aria-hidden
            >
              <Icon className="size-[18px] text-accent" strokeWidth={2} />
            </div>
            <div>
              <div className="text-small font-medium text-text-primary">
                {title}
              </div>
              <div className="mt-0.5 text-small text-text-tertiary">{body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats strip */}
      <div className="relative z-[1] mt-12 grid grid-cols-3 gap-0 border-t border-border-thin pt-6">
        {[
          { n: "26,095", l: "sets" },
          { n: "11%", l: "avg annual return" },
          { n: "3", l: "price sources" },
        ].map((s, i) => (
          <div
            key={s.l}
            className={
              i === 0
                ? "pr-4"
                : i === 1
                  ? "border-l border-border-thin px-4"
                  : "border-l border-border-thin pl-4"
            }
          >
            <div className="font-mono text-xl font-medium tabular-nums text-text-primary">
              {s.n}
            </div>
            <div className="mt-0.5 text-micro font-mono tracking-wider text-text-quaternary">
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
