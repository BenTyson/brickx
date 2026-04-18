"use client";

import { Suspense } from "react";
import { CatalogPageClient } from "@/components/catalog-v2/catalog-page-client";
import { useDemoPalette } from "@/components/catalog-v2/demo-command-palette";
import { CatalogGridSkeleton } from "@/components/catalog-v2/catalog-skeleton";

export default function SetsDemoPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1320px] px-6 pb-24 pt-10 sm:px-10 lg:px-14">
          <CatalogGridSkeleton />
        </div>
      }
    >
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const { open } = useDemoPalette();
  return <CatalogPageClient onOpenPalette={open} />;
}
