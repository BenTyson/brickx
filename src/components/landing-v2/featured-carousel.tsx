"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/motion";
import { SetCardV2 } from "@/components/ui/set-card-v2";
import type { SeriesPoint } from "@/lib/mock/series";

type FeaturedSet = {
  id: string;
  name: string;
  theme: string;
  year: number;
  status: "available" | "retired" | "retiring-soon" | "exclusive" | "unreleased";
  msrp: number;
  current: number;
  delta: number;
  series: SeriesPoint[];
};

/**
 * Horizontal scroll-snap carousel of SetCardV2. Native scroll + snap points,
 * arrow buttons scroll by one card width. No JS snapping required.
 */
export function FeaturedCarousel({ sets }: { sets: FeaturedSet[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 320) + 20;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-14">
        <ScrollReveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-micro font-mono font-tabular text-text-tertiary">
                03 · Featured sets
              </div>
              <h2 className="mt-4 max-w-[680px] text-h2 font-serif-display italic text-text-primary">
                What&rsquo;s moving this week.
              </h2>
            </div>
            <div className="hidden gap-2 md:flex">
              <CarouselButton direction="left" onClick={() => scrollBy(-1)} />
              <CarouselButton direction="right" onClick={() => scrollBy(1)} />
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div
        ref={ref}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none] sm:px-10 lg:px-14 [&::-webkit-scrollbar]:hidden"
      >
        {sets.map((s) => (
          <div
            key={s.id}
            data-card
            className="w-[280px] shrink-0 snap-start sm:w-[320px]"
          >
            <SetCardV2
              id={s.id}
              name={s.name}
              theme={s.theme}
              year={s.year}
              status={s.status}
              msrp={s.msrp}
              currentValue={s.current}
              pctChange={s.delta}
              sparkline={s.series}
              href={`#set-${s.id}`}
            />
          </div>
        ))}
        <div className="w-6 shrink-0 sm:w-10 lg:w-14" aria-hidden />
      </div>
    </section>
  );
}

function CarouselButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className="inline-flex size-10 items-center justify-center rounded-full border border-border-thin bg-bg-raised text-text-secondary transition hover:border-border-emphasis hover:bg-bg-overlay hover:text-text-primary"
    >
      <Icon className="size-4" />
    </button>
  );
}
