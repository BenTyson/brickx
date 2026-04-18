"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { SetDetailImage } from "@/lib/mock/set-detail";

interface SetImageLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: SetDetailImage[];
  startIndex?: number;
  setName: string;
}

/**
 * Multi-angle lightbox — keyboard navigable (arrow keys + esc),
 * click backdrop to close.
 */
export function SetImageLightbox({
  open,
  onOpenChange,
  images,
  startIndex = 0,
  setName,
}: SetImageLightboxProps) {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    if (open) setIdx(startIndex);
  }, [open, startIndex]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setIdx((i) => (i - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange, images.length]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${setName} gallery`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex flex-col bg-bg-base/95 backdrop-blur"
          onClick={() => onOpenChange(false)}
        >
          <header className="flex items-center justify-between border-b border-border-thin px-6 py-4">
            <span className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
              {idx + 1} / {images.length} · {images[idx]?.caption}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChange(false);
              }}
              className="inline-flex size-9 items-center justify-center rounded-full border border-border-emphasis bg-bg-raised text-text-secondary transition hover:text-text-primary"
              aria-label="Close gallery"
            >
              <X className="size-4" strokeWidth={2.2} />
            </button>
          </header>

          <div
            className="relative flex flex-1 items-center justify-center px-6 py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full border border-border-emphasis bg-bg-raised text-text-secondary transition hover:text-text-primary"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" strokeWidth={2} />
            </button>

            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full max-h-[78vh] w-full max-w-4xl"
            >
              {images[idx]?.url && (
                <Image
                  src={images[idx].url}
                  alt={images[idx].alt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 1024px"
                  className="object-contain"
                  priority
                />
              )}
            </motion.div>

            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full border border-border-emphasis bg-bg-raised text-text-secondary transition hover:text-text-primary"
              aria-label="Next image"
            >
              <ChevronRight className="size-5" strokeWidth={2} />
            </button>
          </div>

          <footer
            className="flex items-center justify-center gap-2 border-t border-border-thin px-6 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Show ${img.caption}`}
                className={cn(
                  "h-1 w-10 rounded-full transition",
                  i === idx ? "bg-accent" : "bg-border-emphasis hover:bg-text-quaternary",
                )}
              />
            ))}
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
