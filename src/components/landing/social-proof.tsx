"use client";

import { ScrollReveal } from "@/components/motion";
import { CountUp } from "@/components/motion/count-up";

const stats = [
  { value: 26095, label: "Sets indexed" },
  { value: 4.2, suffix: "M", prefix: "$", label: "Tracked portfolio value", decimals: 1 },
  { value: 1840, label: "Collectors on the waitlist" },
  { value: 15, suffix: " yrs", label: "Of price history" },
];

export function SocialProof() {
  return (
    <section className="border-y border-border-thin bg-bg-raised/40">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-6 gap-y-10 px-6 py-16 sm:px-10 md:grid-cols-4 lg:px-14">
        {stats.map((s, i) => (
          <ScrollReveal key={i} delay={i * 0.05}>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-1">
                {s.prefix && (
                  <span className="font-mono font-tabular text-xl text-text-tertiary">
                    {s.prefix}
                  </span>
                )}
                <CountUp
                  value={s.value}
                  decimals={s.decimals ?? 0}
                  suffix={s.suffix ?? ""}
                  className="font-mono font-tabular text-4xl text-text-primary tabular-nums tracking-tight"
                />
              </div>
              <div className="text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
                {s.label}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
