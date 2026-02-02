"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { CatalogFilterOptions } from "@/lib/types/catalog";

interface CatalogFiltersProps {
  options: CatalogFilterOptions;
}

export function CatalogFilters({ options }: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedThemes = new Set(
    (searchParams.get("theme") ?? "").split(",").filter(Boolean).map(Number),
  );
  const selectedStatuses = new Set(
    (searchParams.get("status") ?? "").split(",").filter(Boolean),
  );
  const yearMin = searchParams.get("yearMin") ?? "";
  const yearMax = searchParams.get("yearMax") ?? "";
  const priceMin = searchParams.get("priceMin") ?? "";
  const priceMax = searchParams.get("priceMax") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      params.delete("page");
      router.replace(`/sets?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const toggleTheme = (id: number) => {
    const next = new Set(selectedThemes);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    updateParams({
      theme: next.size > 0 ? Array.from(next).join(",") : null,
    });
  };

  const toggleStatus = (status: string) => {
    const next = new Set(selectedStatuses);
    if (next.has(status)) {
      next.delete(status);
    } else {
      next.add(status);
    }
    updateParams({
      status: next.size > 0 ? Array.from(next).join(",") : null,
    });
  };

  const hasFilters =
    selectedThemes.size > 0 ||
    selectedStatuses.size > 0 ||
    yearMin ||
    yearMax ||
    priceMin ||
    priceMax;

  const clearAll = () => {
    updateParams({
      theme: null,
      status: null,
      yearMin: null,
      yearMax: null,
      priceMin: null,
      priceMax: null,
    });
  };

  const displayedThemes = options.themes.slice(0, 20);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-muted-foreground h-auto px-2 py-1 text-xs"
          >
            <X className="mr-1 size-3" />
            Clear all
          </Button>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["theme", "year", "status", "price"]}
      >
        {/* Theme filter */}
        <AccordionItem value="theme">
          <AccordionTrigger>Theme</AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-56">
              <div className="space-y-2 pr-3">
                {displayedThemes.map((theme) => (
                  <div key={theme.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`theme-${theme.id}`}
                      checked={selectedThemes.has(theme.id)}
                      onCheckedChange={() => toggleTheme(theme.id)}
                    />
                    <Label
                      htmlFor={`theme-${theme.id}`}
                      className="flex-1 cursor-pointer text-sm font-normal"
                    >
                      {theme.name}
                    </Label>
                    <span className="text-muted-foreground text-xs">
                      {theme.count}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        {/* Year range */}
        <AccordionItem value="year">
          <AccordionTrigger>Year</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder={String(options.yearRange.min)}
                value={yearMin}
                onChange={(e) =>
                  updateParams({ yearMin: e.target.value || null })
                }
                className="h-8"
                aria-label="Minimum year"
              />
              <span className="text-muted-foreground text-sm">\u2013</span>
              <Input
                type="number"
                placeholder={String(options.yearRange.max)}
                value={yearMax}
                onChange={(e) =>
                  updateParams({ yearMax: e.target.value || null })
                }
                className="h-8"
                aria-label="Maximum year"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Status filter */}
        <AccordionItem value="status">
          <AccordionTrigger>Status</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {options.statusCounts.map(({ status, count }) => (
                <div key={status} className="flex items-center gap-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={selectedStatuses.has(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  />
                  <Label
                    htmlFor={`status-${status}`}
                    className="flex-1 cursor-pointer text-sm font-normal capitalize"
                  >
                    {status}
                  </Label>
                  <span className="text-muted-foreground text-xs">{count}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* MSRP price range */}
        <AccordionItem value="price">
          <AccordionTrigger>MSRP Price</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="text-muted-foreground absolute top-1/2 left-2 -translate-y-1/2 text-sm">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) =>
                    updateParams({ priceMin: e.target.value || null })
                  }
                  className="h-8 pl-5"
                  aria-label="Minimum price"
                />
              </div>
              <span className="text-muted-foreground text-sm">\u2013</span>
              <div className="relative flex-1">
                <span className="text-muted-foreground absolute top-1/2 left-2 -translate-y-1/2 text-sm">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) =>
                    updateParams({ priceMax: e.target.value || null })
                  }
                  className="h-8 pl-5"
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
