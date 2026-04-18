"use client";

import Image from "next/image";
import { useState, useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Maximize2, Package } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { SetDetailImage } from "@/lib/mock/set-detail";
import { SetImageLightbox } from "./set-image-lightbox";

interface SetImageGalleryProps {
  images: SetDetailImage[];
  setName: string;
}

/**
 * Hero image with parallax tilt on hover, thumbnail strip below,
 * lightbox on click. Falls back to a placeholder when no image.
 */
export function SetImageGallery({ images, setName }: SetImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const wrapRef = useRef<HTMLButtonElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rxSpring = useSpring(rx, { stiffness: 150, damping: 14 });
  const rySpring = useSpring(ry, { stiffness: 150, damping: 14 });
  const rotateX = useTransform(rxSpring, (v) => `${v}deg`);
  const rotateY = useTransform(rySpring, (v) => `${v}deg`);

  function onMove(e: MouseEvent<HTMLButtonElement>) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(x * 8);
    rx.set(-y * 8);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  const current = images[active];

  return (
    <div className="space-y-4">
      <button
        ref={wrapRef}
        type="button"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={() => setLightbox(true)}
        aria-label={`View ${setName} larger`}
        className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-border-thin bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--accent)_8%,transparent),transparent_55%)] [perspective:1200px]"
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative h-full w-full"
        >
          {current?.url ? (
            <Image
              src={current.url}
              alt={current.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 540px"
              priority
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="size-24 text-text-quaternary" />
            </div>
          )}
        </motion.div>
        <span className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full bg-bg-overlay/80 text-text-secondary opacity-0 backdrop-blur transition group-hover:opacity-100">
          <Maximize2 className="size-3.5" strokeWidth={2.4} />
        </span>
        {current?.caption && (
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-bg-overlay/85 px-2 py-0.5 text-[10px] font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary backdrop-blur">
            {current.caption}
          </span>
        )}
      </button>

      <div className="grid grid-cols-4 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View ${img.caption ?? "image"}`}
            className={cn(
              "relative aspect-square overflow-hidden rounded-lg border bg-bg-overlay transition",
              active === i
                ? "border-accent ring-1 ring-accent"
                : "border-border-thin hover:border-border-emphasis",
            )}
          >
            {img.url ? (
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="120px"
                className="object-contain p-2"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="size-5 text-text-quaternary" />
              </div>
            )}
          </button>
        ))}
      </div>

      <SetImageLightbox
        open={lightbox}
        onOpenChange={setLightbox}
        images={images}
        startIndex={active}
        setName={setName}
      />
    </div>
  );
}
