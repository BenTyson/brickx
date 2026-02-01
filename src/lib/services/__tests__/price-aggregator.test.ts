import { describe, it, expect } from "vitest";
import {
  computeWeightedAverage,
  computePctChange,
  computeAnnualGrowth,
  computeInvestmentScore,
  computeMarketValue,
} from "@/lib/services/price-aggregator";
import type { Database } from "@/lib/types/database";

type SetPriceRow = Database["public"]["Tables"]["set_prices"]["Row"];

function makePrice(
  overrides: Partial<SetPriceRow> & { set_id: string; source: string },
): SetPriceRow {
  const { set_id, source, ...rest } = overrides;
  return {
    id: "price-1",
    new_avg: null,
    new_min: null,
    new_max: null,
    new_qty_sold: null,
    used_avg: null,
    used_min: null,
    used_max: null,
    used_qty_sold: null,
    fetched_at: new Date().toISOString(),
    ...rest,
    set_id,
    source,
  };
}

describe("computeWeightedAverage", () => {
  it("returns null for empty prices", () => {
    expect(computeWeightedAverage([], "new_avg")).toBeNull();
  });

  it("returns single source value when only one source", () => {
    const prices = [
      { source: "bricklink", new_avg: 100, used_avg: 50, new_qty_sold: 10 },
    ];
    expect(computeWeightedAverage(prices, "new_avg")).toBe(100);
  });

  it("computes weighted average across multiple sources", () => {
    const prices = [
      { source: "bricklink", new_avg: 100, used_avg: null, new_qty_sold: 10 },
      {
        source: "brickeconomy",
        new_avg: 120,
        used_avg: null,
        new_qty_sold: null,
      },
      { source: "brickowl", new_avg: 90, used_avg: null, new_qty_sold: null },
    ];
    // (100*0.5 + 120*0.3 + 90*0.2) / (0.5+0.3+0.2) = (50+36+18)/1.0 = 104
    expect(computeWeightedAverage(prices, "new_avg")).toBe(104);
  });

  it("handles all null values", () => {
    const prices = [
      {
        source: "bricklink",
        new_avg: null,
        used_avg: null,
        new_qty_sold: null,
      },
      {
        source: "brickeconomy",
        new_avg: null,
        used_avg: null,
        new_qty_sold: null,
      },
    ];
    expect(computeWeightedAverage(prices, "new_avg")).toBeNull();
  });

  it("normalizes by available weights when some sources null", () => {
    const prices = [
      { source: "bricklink", new_avg: 100, used_avg: null, new_qty_sold: 10 },
      {
        source: "brickeconomy",
        new_avg: null,
        used_avg: null,
        new_qty_sold: null,
      },
      { source: "brickowl", new_avg: 80, used_avg: null, new_qty_sold: null },
    ];
    // (100*0.5 + 80*0.2) / (0.5+0.2) = (50+16)/0.7 = 94.29
    expect(computeWeightedAverage(prices, "new_avg")).toBeCloseTo(94.29, 1);
  });

  it("computes used_avg weighted average", () => {
    const prices = [
      { source: "bricklink", new_avg: null, used_avg: 60, new_qty_sold: null },
      {
        source: "brickeconomy",
        new_avg: null,
        used_avg: 80,
        new_qty_sold: null,
      },
    ];
    // (60*0.5 + 80*0.3) / (0.5+0.3) = (30+24)/0.8 = 67.5
    expect(computeWeightedAverage(prices, "used_avg")).toBe(67.5);
  });
});

describe("computePctChange", () => {
  it("returns null when latestValue is null", () => {
    expect(computePctChange(null, [], 7)).toBeNull();
  });

  it("returns null when latestValue is 0", () => {
    expect(computePctChange(0, [], 7)).toBeNull();
  });

  it("returns null with no historical prices", () => {
    expect(computePctChange(100, [], 7)).toBeNull();
  });

  it("returns null when no price is within tolerance", () => {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const prices = [
      makePrice({
        set_id: "75192-1",
        source: "bricklink",
        new_avg: 80,
        fetched_at: tenDaysAgo.toISOString(),
      }),
    ];
    // Looking for 7 days ago, nearest is 10 days ago => >3 day tolerance
    expect(computePctChange(100, prices, 7)).toBeNull();
  });

  it("computes positive percentage change", () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const prices = [
      makePrice({
        set_id: "75192-1",
        source: "bricklink",
        new_avg: 80,
        fetched_at: sevenDaysAgo.toISOString(),
      }),
    ];
    // (100 - 80) / 80 * 100 = 25%
    expect(computePctChange(100, prices, 7)).toBe(25);
  });

  it("computes negative percentage change", () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const prices = [
      makePrice({
        set_id: "75192-1",
        source: "bricklink",
        new_avg: 100,
        fetched_at: sevenDaysAgo.toISOString(),
      }),
    ];
    // (80 - 100) / 100 * 100 = -20%
    expect(computePctChange(80, prices, 7)).toBe(-20);
  });
});

describe("computeAnnualGrowth", () => {
  it("returns null with fewer than 2 prices", () => {
    expect(computeAnnualGrowth([])).toBeNull();
    expect(
      computeAnnualGrowth([
        makePrice({
          set_id: "75192-1",
          source: "bricklink",
          new_avg: 100,
        }),
      ]),
    ).toBeNull();
  });

  it("returns null when all new_avg are null", () => {
    const prices = [
      makePrice({
        set_id: "75192-1",
        source: "bricklink",
        new_avg: null,
        fetched_at: "2024-01-01T00:00:00Z",
      }),
      makePrice({
        set_id: "75192-1",
        source: "bricklink",
        new_avg: null,
        fetched_at: "2024-07-01T00:00:00Z",
      }),
    ];
    expect(computeAnnualGrowth(prices)).toBeNull();
  });

  it("returns null when time span < 30 days", () => {
    const prices = [
      makePrice({
        set_id: "75192-1",
        source: "bricklink",
        new_avg: 100,
        fetched_at: "2024-06-01T00:00:00Z",
      }),
      makePrice({
        set_id: "75192-1",
        source: "bricklink",
        new_avg: 110,
        fetched_at: "2024-06-15T00:00:00Z",
      }),
    ];
    expect(computeAnnualGrowth(prices)).toBeNull();
  });

  it("computes annualized growth for price increase", () => {
    const prices = [
      makePrice({
        set_id: "75192-1",
        source: "bricklink",
        new_avg: 100,
        fetched_at: "2024-01-01T00:00:00Z",
      }),
      makePrice({
        set_id: "75192-1",
        source: "bricklink",
        new_avg: 200,
        fetched_at: "2025-01-01T00:00:00Z",
      }),
    ];
    const result = computeAnnualGrowth(prices);
    expect(result).not.toBeNull();
    // ~100% annual growth (doubling in ~1 year)
    expect(result!).toBeCloseTo(100, 0);
  });
});

describe("computeInvestmentScore", () => {
  it("returns null when no components have data", () => {
    expect(computeInvestmentScore(null, null, null, null, null)).toBeNull();
  });

  it("scores a high-value set with strong growth", () => {
    const score = computeInvestmentScore(1200, 15, 25, 500, 25);
    expect(score).not.toBeNull();
    expect(score!).toBeGreaterThan(50);
    expect(score!).toBeLessThanOrEqual(100);
  });

  it("scores with partial data (only market value)", () => {
    const score = computeInvestmentScore(250, null, null, null, null);
    expect(score).not.toBeNull();
    // 15 out of 25 => 60
    expect(score!).toBe(60);
  });

  it("scores with partial data (value + momentum)", () => {
    const score = computeInvestmentScore(250, 10, 20, null, null);
    expect(score).not.toBeNull();
    expect(score!).toBeGreaterThan(0);
    expect(score!).toBeLessThanOrEqual(100);
  });

  it("scores low for cheap set with negative growth", () => {
    const score = computeInvestmentScore(20, -30, -40, 5, -10);
    expect(score).not.toBeNull();
    expect(score!).toBeLessThan(30);
  });
});

describe("computeMarketValue", () => {
  it("returns null for empty prices", () => {
    expect(computeMarketValue([], [])).toBeNull();
  });

  it("returns null when no set_id available from historical", () => {
    const latest = [
      { source: "bricklink", new_avg: 100, used_avg: 50, new_qty_sold: 10 },
    ];
    expect(computeMarketValue(latest, [])).toBeNull();
  });

  it("assembles market value correctly", () => {
    const historical = [
      makePrice({
        set_id: "75192-1",
        source: "bricklink",
        new_avg: 95,
        fetched_at: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      }),
    ];
    const latest = [
      { source: "bricklink", new_avg: 100, used_avg: 60, new_qty_sold: 50 },
      {
        source: "brickeconomy",
        new_avg: 110,
        used_avg: 70,
        new_qty_sold: null,
      },
    ];
    const result = computeMarketValue(latest, historical);
    expect(result).not.toBeNull();
    expect(result!.set_id).toBe("75192-1");
    expect(result!.market_value_new).not.toBeNull();
    expect(result!.market_value_used).not.toBeNull();
  });

  it("handles single source", () => {
    const historical = [
      makePrice({
        set_id: "10300-1",
        source: "bricklink",
        new_avg: 200,
        fetched_at: new Date().toISOString(),
      }),
    ];
    const latest = [
      { source: "bricklink", new_avg: 200, used_avg: 150, new_qty_sold: 100 },
    ];
    const result = computeMarketValue(latest, historical);
    expect(result).not.toBeNull();
    expect(result!.market_value_new).toBe(200);
    expect(result!.market_value_used).toBe(150);
  });
});
