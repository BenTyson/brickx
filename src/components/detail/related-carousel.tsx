"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, Package } from "lucide-react";
import { DeltaChip } from "@/components/ui/delta-chip";
import { cn } from "@/lib/utils/cn";
import type { CatalogSetView } from "@/lib/view-models/catalog";

interface RelatedCarouselProps {
  themeName: string;
  themeSlug: string;
  sets: CatalogSetView[];
}

export function RelatedCarousel({
  themeName,
  themeSlug,
  sets,
}: RelatedCarouselProps) {
  const scroller = useRef<HTMLDivElement>(null);

  function nudge(dir: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * 360, behavior: "smooth" });
  }

  if (!sets.length) return null;

  return (
    <section
      aria-labelledby="related-sets"
      className="space-y-5 rounded-2xl border border-border-thin bg-card p-6 lg:p-8"
    >
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
            04 · Related
          </div>
          <h2
            id="related-sets"
            className="mt-2 text-h3 font-medium tracking-tight text-text-primary"
          >
            More from {themeName}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/themes/${themeSlug}`}
            className="text-small text-text-secondary transition hover:text-text-primary"
          >
            View theme →
          </Link>
          <div className="hidden gap-1 sm:flex">
            <CarouselButton onClick={() => nudge(-1)} label="Scroll left">
              <ArrowLeft className="size-4" strokeWidth={2.2} />
            </CarouselButton>
            <CarouselButton onClick={() => nudge(1)} label="Scroll right">
              <ArrowRight className="size-4" strokeWidth={2.2} />
            </CarouselButton>
          </div>
        </div>
      </header>

      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sets.map((s) => (
          <Link
            key={s.id}
            href={`/sets/${s.id}`}
            className="group relative flex w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-border-thin bg-bg-raised transition hover:border-border-emphasis"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-bg-overlay">
              {s.imgUrl ? (
                <Image
                  src={s.imgUrl}
                  alt={s.name}
                  fill
                  sizes="260px"
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="size-10 text-text-quaternary" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div>
                <div className="text-micro font-mono font-tabular text-text-tertiary">
                  {s.id} · {s.year}
                </div>
                <h3 className="mt-1 line-clamp-1 text-small font-medium text-text-primary">
                  {s.name}
                </h3>
              </div>
              <div className="mt-auto flex items-end justify-between gap-2">
                <div className="font-mono font-tabular tabular-nums text-text-primary">
                  {s.currentValue > 0 ? `$${s.currentValue.toFixed(0)}` : "—"}
                </div>
                <DeltaChip value={s.pctChange30d} size="sm" hideIcon />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CarouselButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-full border border-border-thin bg-bg-raised text-text-secondary",
        "transition hover:border-border-emphasis hover:text-text-primary",
      )}
    >
      {children}
    </button>
  );
}
