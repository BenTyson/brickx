import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchPortfolioHistory } from "@/lib/queries";
import type { PortfolioHistoryRange } from "@/lib/types/collection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_RANGES: PortfolioHistoryRange[] = ["1W", "1M", "3M", "1Y", "ALL"];

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const raw = url.searchParams.get("range") ?? "1M";
  const range = (
    VALID_RANGES.includes(raw as PortfolioHistoryRange) ? raw : "1M"
  ) as PortfolioHistoryRange;

  const history = await fetchPortfolioHistory(range);
  return NextResponse.json(history);
}
