"use client";

import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Package } from "lucide-react";

export interface SetDetailImage {
  url: string | null;
  alt: string;
}

interface SetImageGalleryProps {
  images: SetDetailImage[];
  setName: string;
}

/**
 * Hero image with parallax tilt on hover. For sets with a single image
 * we render just the tile; the thumbnail strip appears only when multiple
 * images are available.
 */
export function SetImageGallery({ images, setName }: SetImageGalleryProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rxSpring = useSpring(rx, { stiffness: 150, damping: 14 });
  const rySpring = useSpring(ry, { stiffness: 150, damping: 14 });
  const rotateX = useTransform(rxSpring, (v) => `${v}deg`);
  const rotateY = useTransform(rySpring, (v) => `${v}deg`);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(x * 6);
    rx.set(-y * 6);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  const hero = images[0];

  return (
    <div className="space-y-4">
      <div
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        aria-label={setName}
        className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-border-thin bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--accent)_8%,transparent),transparent_55%)] [perspective:1200px]"
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative h-full w-full"
        >
          {hero?.url ? (
            <Image
              src={hero.url}
              alt={hero.alt}
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
      </div>
    </div>
  );
}
