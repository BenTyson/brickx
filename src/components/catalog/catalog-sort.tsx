"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { value: "name-asc", label: "Name A\u2013Z" },
  { value: "name-desc", label: "Name Z\u2013A" },
  { value: "year-desc", label: "Year (Newest)" },
  { value: "year-asc", label: "Year (Oldest)" },
  { value: "msrp_usd-asc", label: "MSRP (Low\u2013High)" },
  { value: "msrp_usd-desc", label: "MSRP (High\u2013Low)" },
  { value: "market_value_new-desc", label: "Market Value (High\u2013Low)" },
  { value: "market_value_new-asc", label: "Market Value (Low\u2013High)" },
  { value: "investment_score-desc", label: "Investment Score (High\u2013Low)" },
  { value: "pct_change_30d-desc", label: "30d Change (High\u2013Low)" },
  { value: "num_parts-desc", label: "Parts (Most)" },
  { value: "num_parts-asc", label: "Parts (Fewest)" },
];

export function CatalogSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") ?? "name";
  const order = searchParams.get("order") ?? "asc";
  const currentValue = `${sort}-${order}`;

  const handleChange = (value: string) => {
    const [newSort, newOrder] = value.split("-");
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("order", newOrder);
    params.delete("page");
    router.replace(`/sets?${params.toString()}`, { scroll: false });
  };

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger className="w-[200px]" aria-label="Sort sets">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
