"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PriceRangeFilterProps {
  currentMin?: number;
  currentMax?: number;
}

export function PriceRangeFilter({
  currentMin,
  currentMax,
}: PriceRangeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [min, setMin] = useState(currentMin?.toString() ?? "");
  const [max, setMax] = useState(currentMax?.toString() ?? "");

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) {
      params.set("priceMin", min);
    } else {
      params.delete("priceMin");
    }
    if (max) {
      params.set("priceMax", max);
    } else {
      params.delete("priceMax");
    }
    params.delete("page");
    const qs = params.toString();
    router.replace(`/market/top-investments${qs ? `?${qs}` : ""}`, {
      scroll: false,
    });
  };

  const handleClear = () => {
    setMin("");
    setMax("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("priceMin");
    params.delete("priceMax");
    params.delete("page");
    const qs = params.toString();
    router.replace(`/market/top-investments${qs ? `?${qs}` : ""}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label htmlFor="priceMin" className="text-sm">
          Min MSRP ($)
        </Label>
        <Input
          id="priceMin"
          type="number"
          placeholder="0"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="w-28"
          min={0}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="priceMax" className="text-sm">
          Max MSRP ($)
        </Label>
        <Input
          id="priceMax"
          type="number"
          placeholder="Any"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="w-28"
          min={0}
        />
      </div>
      <Button onClick={handleApply} size="sm">
        Apply
      </Button>
      {(min || max) && (
        <Button onClick={handleClear} variant="ghost" size="sm">
          Clear
        </Button>
      )}
    </div>
  );
}
