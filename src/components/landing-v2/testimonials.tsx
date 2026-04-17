"use client";

import { Quote } from "lucide-react";
import { ScrollReveal, StaggerChildren } from "@/components/motion";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

const items: Testimonial[] = [
  {
    quote:
      "I used to run a 400-set spreadsheet that broke every time BrickLink changed an ID. BrickX gives me one number per set, and a chart that doesn't lie.",
    author: "Marcus K.",
    role: "Collector, 12 years",
  },
  {
    quote:
      "The retirement intelligence alone paid for itself. I got the Modular alert the day it flipped, bought three, they're up 40% since.",
    author: "Priya S.",
    role: "Portfolio 220 sets",
  },
  {
    quote:
      "Finally a LEGO tool that treats it like a real asset. The indices are a genuinely new way to look at the market.",
    author: "Daniel R.",
    role: "AFOL since 2009",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 lg:px-14">
      <ScrollReveal>
        <div className="text-micro font-mono font-tabular text-text-tertiary">
          05 · Signal
        </div>
        <h2 className="mt-4 max-w-[680px] text-h2 font-serif-display italic text-text-primary">
          From people who actually track this stuff.
        </h2>
      </ScrollReveal>

      <StaggerChildren className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((t) => (
          <figure
            key={t.author}
            className="flex h-full flex-col justify-between rounded-xl border border-border-thin bg-card p-6 transition hover:border-border-emphasis"
          >
            <Quote
              className="size-5 text-accent"
              strokeWidth={1.5}
              aria-hidden
            />
            <blockquote className="mt-6 text-body text-text-secondary">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 border-t border-border-thin pt-4">
              <div className="text-small text-text-primary">{t.author}</div>
              <div className="text-micro font-mono font-tabular text-text-tertiary">
                {t.role}
              </div>
            </figcaption>
          </figure>
        ))}
      </StaggerChildren>
    </section>
  );
}
