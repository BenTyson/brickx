"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CatalogFilterOptions } from "@/lib/types/catalog";

interface ActiveFiltersProps {
  options: CatalogFilterOptions;
}

export function ActiveFilters({ options }: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pills: { label: string; paramKey: string; paramValue?: string }[] = [];

  // Search query
  const q = searchParams.get("q");
  if (q) {
    pills.push({ label: `Search: "${q}"`, paramKey: "q" });
  }

  // Theme filters
  const themeStr = searchParams.get("theme");
  if (themeStr) {
    const themeIds = themeStr.split(",").map(Number);
    for (const id of themeIds) {
      const theme = options.themes.find((t) => t.id === id);
      if (theme) {
        pills.push({
          label: theme.name,
          paramKey: "theme",
          paramValue: String(id),
        });
      }
    }
  }

  // Status filters
  const statusStr = searchParams.get("status");
  if (statusStr) {
    for (const status of statusStr.split(",")) {
      pills.push({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        paramKey: "status",
        paramValue: status,
      });
    }
  }

  // Year range
  const yearMin = searchParams.get("yearMin");
  const yearMax = searchParams.get("yearMax");
  if (yearMin || yearMax) {
    const label =
      yearMin && yearMax
        ? `Year: ${yearMin}\u2013${yearMax}`
        : yearMin
          ? `Year: ${yearMin}+`
          : `Year: \u2264${yearMax}`;
    pills.push({ label, paramKey: "yearRange" });
  }

  // Price range
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  if (priceMin || priceMax) {
    const label =
      priceMin && priceMax
        ? `MSRP: $${priceMin}\u2013$${priceMax}`
        : priceMin
          ? `MSRP: $${priceMin}+`
          : `MSRP: \u2264$${priceMax}`;
    pills.push({ label, paramKey: "priceRange" });
  }

  if (pills.length === 0) return null;

  const removePill = (pill: (typeof pills)[0]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (pill.paramKey === "yearRange") {
      params.delete("yearMin");
      params.delete("yearMax");
    } else if (pill.paramKey === "priceRange") {
      params.delete("priceMin");
      params.delete("priceMax");
    } else if (pill.paramValue) {
      // Remove a single value from a comma-separated list
      const current = params.get(pill.paramKey);
      if (current) {
        const values = current.split(",").filter((v) => v !== pill.paramValue);
        if (values.length > 0) {
          params.set(pill.paramKey, values.join(","));
        } else {
          params.delete(pill.paramKey);
        }
      }
    } else {
      params.delete(pill.paramKey);
    }

    params.delete("page");
    router.replace(`/sets?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((pill, i) => (
        <Badge
          key={`${pill.paramKey}-${pill.paramValue ?? i}`}
          variant="secondary"
          className="cursor-pointer gap-1 pr-1"
          onClick={() => removePill(pill)}
        >
          {pill.label}
          <X className="size-3" />
        </Badge>
      ))}
    </div>
  );
}
