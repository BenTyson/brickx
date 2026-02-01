import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { logger } from "@/lib/utils/logger";

type AdminClient = SupabaseClient<Database>;
type SetPriceRow = Database["public"]["Tables"]["set_prices"]["Row"];
type MarketValueInsert =
  Database["public"]["Tables"]["set_market_values"]["Insert"];

const SOURCE_WEIGHTS: Record<string, number> = {
  bricklink: 0.5,
  brickeconomy: 0.3,
  brickowl: 0.2,
};

interface PricePoint {
  source: string;
  new_avg: number | null;
  used_avg: number | null;
  new_qty_sold: number | null;
}

export function computeWeightedAverage(
  prices: PricePoint[],
  field: "new_avg" | "used_avg",
): number | null {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const p of prices) {
    const value = p[field];
    if (value == null) continue;
    const weight = SOURCE_WEIGHTS[p.source] ?? 0.1;
    weightedSum += value * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return null;
  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

export function computePctChange(
  latestValue: number | null,
  historicalPrices: SetPriceRow[],
  targetDaysAgo: number,
): number | null {
  if (latestValue == null || latestValue === 0) return null;
  if (historicalPrices.length === 0) return null;

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - targetDaysAgo);
  const targetMs = targetDate.getTime();
  const toleranceMs = 3 * 24 * 60 * 60 * 1000; // 3 days

  let closest: SetPriceRow | null = null;
  let closestDiff = Infinity;

  for (const row of historicalPrices) {
    const rowMs = new Date(row.fetched_at).getTime();
    const diff = Math.abs(rowMs - targetMs);
    if (diff <= toleranceMs && diff < closestDiff) {
      closest = row;
      closestDiff = diff;
    }
  }

  if (!closest) return null;

  const oldValue = closest.new_avg;
  if (oldValue == null || oldValue === 0) return null;

  return Math.round(((latestValue - oldValue) / oldValue) * 10000) / 100;
}

export function computeAnnualGrowth(
  historicalPrices: SetPriceRow[],
): number | null {
  if (historicalPrices.length < 2) return null;

  const sorted = [...historicalPrices]
    .filter((p) => p.new_avg != null)
    .sort(
      (a, b) =>
        new Date(a.fetched_at).getTime() - new Date(b.fetched_at).getTime(),
    );

  if (sorted.length < 2) return null;

  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];
  const daysDiff =
    (new Date(newest.fetched_at).getTime() -
      new Date(oldest.fetched_at).getTime()) /
    (1000 * 60 * 60 * 24);

  if (daysDiff < 30) return null;

  const oldVal = oldest.new_avg!;
  const newVal = newest.new_avg!;
  if (oldVal <= 0) return null;

  const years = daysDiff / 365.25;
  const annualReturn = (Math.pow(newVal / oldVal, 1 / years) - 1) * 100;
  return Math.round(annualReturn * 100) / 100;
}

export function computeInvestmentScore(
  marketValueNew: number | null,
  pctChange30d: number | null,
  pctChange90d: number | null,
  totalQtySold: number | null,
  annualGrowth: number | null,
): number | null {
  let score = 0;
  let components = 0;

  // 1. Value tier (0-25)
  if (marketValueNew != null) {
    components++;
    if (marketValueNew >= 1000) score += 25;
    else if (marketValueNew >= 500) score += 20;
    else if (marketValueNew >= 200) score += 15;
    else if (marketValueNew >= 50) score += 10;
    else score += 5;
  }

  // 2. Price momentum — weighted blend of 30d (40%) and 90d (60%)
  if (pctChange30d != null || pctChange90d != null) {
    components++;
    let momentum = 0;
    let mWeight = 0;
    if (pctChange30d != null) {
      momentum += pctChange30d * 0.4;
      mWeight += 0.4;
    }
    if (pctChange90d != null) {
      momentum += pctChange90d * 0.6;
      mWeight += 0.6;
    }
    const blended = momentum / mWeight;
    // Map [-50..+50] to [0..25]
    const clamped = Math.max(-50, Math.min(50, blended));
    score += Math.round(((clamped + 50) / 100) * 25);
  }

  // 3. Market liquidity — log10 of total qty sold
  if (totalQtySold != null && totalQtySold > 0) {
    components++;
    const logQty = Math.log10(totalQtySold);
    // Map [0..4] (1 to 10000 sales) to [0..25]
    const clamped = Math.max(0, Math.min(4, logQty));
    score += Math.round((clamped / 4) * 25);
  }

  // 4. Growth trajectory — annual growth rate tiers
  if (annualGrowth != null) {
    components++;
    if (annualGrowth > 20) score += 25;
    else if (annualGrowth > 10) score += 20;
    else if (annualGrowth > 5) score += 15;
    else if (annualGrowth > 0) score += 10;
    else score += 0;
  }

  if (components === 0) return null;

  // Normalize to 0-100
  return Math.round((score / (components * 25)) * 100);
}

export function computeMarketValue(
  latestPrices: PricePoint[],
  historicalPrices: SetPriceRow[],
): MarketValueInsert | null {
  if (latestPrices.length === 0) return null;

  const setId = historicalPrices.length > 0 ? historicalPrices[0].set_id : null;
  if (!setId) return null;

  const marketValueNew = computeWeightedAverage(latestPrices, "new_avg");
  const marketValueUsed = computeWeightedAverage(latestPrices, "used_avg");

  const pctChange7d = computePctChange(marketValueNew, historicalPrices, 7);
  const pctChange30d = computePctChange(marketValueNew, historicalPrices, 30);
  const pctChange90d = computePctChange(marketValueNew, historicalPrices, 90);
  const growthAnnualPct = computeAnnualGrowth(historicalPrices);

  // Get total qty sold from BrickLink prices
  const blPrice = latestPrices.find((p) => p.source === "bricklink");
  const totalQtySold = blPrice?.new_qty_sold ?? null;

  const investmentScore = computeInvestmentScore(
    marketValueNew,
    pctChange30d,
    pctChange90d,
    totalQtySold,
    growthAnnualPct,
  );

  return {
    set_id: setId,
    market_value_new: marketValueNew,
    market_value_used: marketValueUsed,
    pct_change_7d: pctChange7d,
    pct_change_30d: pctChange30d,
    pct_change_90d: pctChange90d,
    growth_annual_pct: growthAnnualPct,
    investment_score: investmentScore,
  };
}

export async function aggregatePrices(
  supabase: AdminClient,
  setIds?: string[],
): Promise<number> {
  // Get the distinct set IDs to process
  let targetSetIds: string[];
  if (setIds && setIds.length > 0) {
    targetSetIds = setIds;
  } else {
    const { data, error } = await supabase
      .from("set_prices")
      .select()
      .order("set_id");
    if (error) throw new Error(`Failed to fetch set IDs: ${error.message}`);
    const rows = (data ?? []) as SetPriceRow[];
    targetSetIds = [...new Set(rows.map((r) => r.set_id))];
  }

  logger.info("Aggregating prices", { setCount: targetSetIds.length });

  const marketValues: MarketValueInsert[] = [];

  for (const setId of targetSetIds) {
    // Get all prices for this set
    const { data: rawPrices, error } = await supabase
      .from("set_prices")
      .select()
      .eq("set_id", setId)
      .order("fetched_at", { ascending: false });

    if (error) {
      logger.warn(`Failed to fetch prices for ${setId}`, {
        error: error.message,
      });
      continue;
    }

    const allPrices = (rawPrices ?? []) as SetPriceRow[];
    if (allPrices.length === 0) continue;

    // Get latest price per source
    const latestBySource = new Map<string, SetPriceRow>();
    for (const row of allPrices) {
      if (!latestBySource.has(row.source)) {
        latestBySource.set(row.source, row);
      }
    }

    const latestPrices: PricePoint[] = [...latestBySource.values()].map(
      (row) => ({
        source: row.source,
        new_avg: row.new_avg,
        used_avg: row.used_avg,
        new_qty_sold: row.new_qty_sold,
      }),
    );

    const mv = computeMarketValue(latestPrices, allPrices);
    if (mv) {
      marketValues.push(mv);
    }
  }

  // Batch upsert market values
  const BATCH_SIZE = 500;
  for (let i = 0; i < marketValues.length; i += BATCH_SIZE) {
    const batch = marketValues.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("set_market_values")
      .upsert(batch, { onConflict: "set_id" });
    if (error) {
      logger.error("Failed to upsert market values", {
        error: error.message,
      });
      throw new Error(`Market value upsert failed: ${error.message}`);
    }
  }

  logger.info("Aggregation complete", {
    processed: targetSetIds.length,
    valuesWritten: marketValues.length,
  });

  return marketValues.length;
}
