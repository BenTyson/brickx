"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CatalogFilters } from "./catalog-filters";
import type { CatalogFilterOptions } from "@/lib/types/catalog";

interface MobileFilterSheetProps {
  options: CatalogFilterOptions;
}

export function MobileFilterSheet({ options }: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  // Count active filters
  let filterCount = 0;
  if (searchParams.get("theme")) filterCount++;
  if (searchParams.get("status")) filterCount++;
  if (searchParams.get("yearMin") || searchParams.get("yearMax")) filterCount++;
  if (searchParams.get("priceMin") || searchParams.get("priceMax"))
    filterCount++;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="mr-2 size-4" />
          Filters
          {filterCount > 0 && (
            <Badge className="ml-1.5 size-5 justify-center p-0 text-[10px]">
              {filterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-4">
          <CatalogFilters options={options} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
