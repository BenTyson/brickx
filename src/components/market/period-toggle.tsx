"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PeriodToggleProps {
  currentPeriod: "7d" | "30d";
}

export function PeriodToggle({ currentPeriod }: PeriodToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "7d") {
      params.delete("period");
    } else {
      params.set("period", value);
    }
    params.delete("page");
    const qs = params.toString();
    router.replace(`/market/trending${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  return (
    <Tabs value={currentPeriod} onValueChange={handleChange}>
      <TabsList>
        <TabsTrigger value="7d">7 Days</TabsTrigger>
        <TabsTrigger value="30d">30 Days</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
