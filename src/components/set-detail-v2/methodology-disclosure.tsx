"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SOURCES = [
  {
    name: "BrickLink",
    weight: "0.50",
    note: "30-day median sold price across new + used listings, outliers trimmed.",
  },
  {
    name: "BrickEconomy",
    weight: "0.30",
    note: "Aggregate market value, weighted toward sealed condition.",
  },
  {
    name: "BrickOwl",
    weight: "0.20",
    note: "Median asking price, used as a forward-looking signal.",
  },
];

export function MethodologyDisclosure() {
  return (
    <section className="rounded-2xl border border-border-thin bg-card p-6 lg:p-8">
      <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
        03 · Methodology
      </div>
      <h2 className="mt-2 text-h3 font-medium tracking-tight text-text-primary">
        How we calculate market value
      </h2>
      <p className="mt-3 max-w-2xl text-body text-text-secondary">
        BrickX blends three sources into a single new-condition price. We
        recompute every six hours, stamp each tick with a confidence score, and
        keep the full audit trail.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {SOURCES.map((s) => (
          <div
            key={s.name}
            className="rounded-xl border border-border-thin bg-bg-raised p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-small font-medium text-text-primary">
                {s.name}
              </span>
              <span className="rounded-full bg-bg-overlay px-2 py-0.5 font-mono font-tabular tabular-nums text-[11px] text-accent">
                w {s.weight}
              </span>
            </div>
            <p className="mt-2 text-small text-text-tertiary">{s.note}</p>
          </div>
        ))}
      </div>

      <Accordion type="single" collapsible className="mt-6">
        <AccordionItem value="formula" className="border-border-thin">
          <AccordionTrigger className="text-text-primary">
            The aggregation formula
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-text-secondary">
              <span className="font-mono font-tabular text-text-primary">
                value = 0.50 · BL + 0.30 · BE + 0.20 · BO
              </span>
              . When a source is unavailable for a tick we redistribute the
              weight pro rata across the remaining sources. We apply a Hampel
              filter (median ± 4·MAD) to drop outlier listings before each
              source is medianed.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="confidence" className="border-border-thin">
          <AccordionTrigger className="text-text-primary">
            Confidence scoring
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-text-secondary">
              Every price tick gets a 0–100 confidence based on listing depth,
              cross-source agreement, and freshness. Below 70 we flag the
              chart with a hairline marker so you know the value is thin.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="rights" className="border-b-0">
          <AccordionTrigger className="text-text-primary">
            Sources, attribution, and refresh cadence
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-text-secondary">
              Data is fetched under each provider&rsquo;s public API terms.
              Refresh interval is 6 hours; full historical backfill is rebuilt
              nightly. Nothing on this page is investment advice.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
