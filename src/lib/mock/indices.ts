/**
 * Mock market intelligence data for /demo/market/* routes.
 * Covers: named indices, trending, retiring-soon, new releases, news feed, heatmap.
 * Deterministic series via seeded PRNG — stable across renders.
 */

import { CATALOG_SETS, type CatalogSet } from "./catalog";
import { datedRandomWalk, randomWalk, type DatedPoint, type SeriesPoint } from "./series";

// ─── Indices ──────────────────────────────────────────────────────────────────

export interface MarketIndex {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  methodology: string;
  rebalanceNotes: string;
  constituentIds: string[];
  currentValue: number;
  delta1d: number;
  delta7d: number;
  delta30d: number;
  delta1y: number;
  allTimeHigh: number;
  launchYear: number;
  tone: "brand" | "warm" | "cool" | "neutral";
}

const INDEX_DEFS: Omit<MarketIndex, "currentValue" | "allTimeHigh">[] = [
  {
    slug: "brickx-100",
    name: "BrickX 100",
    shortName: "BX100",
    tagline: "The benchmark.",
    description:
      "The 100 most-traded LEGO sets by secondary-market volume, rebalanced quarterly. Tracks broad LEGO market sentiment the way the S&P 500 tracks equities.",
    methodology:
      "Constituents selected from active secondary-market listings across BrickLink, BrickOwl, and BrickEconomy. Weighted by 90-day traded volume (not set count). Capped at 5% per set. Rebalanced quarterly; additions/removals published 10 business days in advance.",
    rebalanceNotes:
      "Q1 2025 rebalance: Added 75367 Venator-Class Cruiser (+high velocity on release), removed 71395 Super Mario 64 (volume declined below threshold). Net sentiment tilt toward large UCS sets continues.",
    constituentIds: [
      "75192", "10276", "10294", "10307", "75252", "21322", "10255", "71043",
      "42115", "10270", "75060", "75309", "10297", "21325", "10256", "75313",
      "42083", "21336", "10278", "10260", "75331", "76269", "10264", "10246",
      "21333", "42143", "76391", "75978", "10283", "10316",
    ],
    delta1d: 0.31,
    delta7d: 1.84,
    delta30d: 3.12,
    delta1y: 14.7,
    launchYear: 2022,
    tone: "brand",
  },
  {
    slug: "star-wars-heat",
    name: "Star Wars Heat Index",
    shortName: "SWHEAT",
    tagline: "The Force is priced in.",
    description:
      "UCS and flagship Star Wars sets, volume-weighted. Heat events — film anniversaries, Disney+ series releases, character reveals — drive outsized short-term moves.",
    methodology:
      "All Star Wars sets with >500 secondary-market transactions in trailing 180 days. Weighted by 30-day BrickLink sale volume. Rebalanced monthly to capture rapid sentiment shifts around media events.",
    rebalanceNotes:
      "March 2025: Removed 75343 Dark Trooper Helmet (volume dipped below threshold post-Mando S3 hype fade). Added 75367 Venator-Class (strong launch). Falcon 75192 remains 8.2% weight — highest single-set concentration in index history.",
    constituentIds: ["75192", "75252", "75313", "75060", "75331", "75309", "75367"],
    delta1d: 0.54,
    delta7d: 2.91,
    delta30d: 4.18,
    delta1y: 19.3,
    launchYear: 2023,
    tone: "warm",
  },
  {
    slug: "modulars",
    name: "Modulars Index",
    shortName: "MODX",
    tagline: "The shelf that pays rent.",
    description:
      "All modular buildings tracked by BrickX, equal-weighted. Modulars show the most predictable retirement-to-appreciation curves of any LEGO theme — the index proves it.",
    methodology:
      "Equal-weight all Modular Buildings sub-theme sets. Rebalanced annually. New sets added at launch; retired sets remain until BrickX removes them from active tracking.",
    rebalanceNotes:
      "2025 annual rebalance: Assembly Square (10255) flagged as retiring — elevated weight in short term. Boutique Hotel added on release. Police Station approaching expected 3yr retirement window.",
    constituentIds: ["10255", "10297", "10270", "10278", "10260", "10264", "10246"],
    delta1d: -0.12,
    delta7d: 0.98,
    delta30d: 2.44,
    delta1y: 11.2,
    launchYear: 2022,
    tone: "cool",
  },
  {
    slug: "retired-gold",
    name: "Retired Gold",
    shortName: "RETGLD",
    tagline: "Discontinued. Appreciated.",
    description:
      "Retired sets with >40% appreciation since EOL, tracked as a pseudo-fixed-income equivalent for the LEGO market. High appreciation, low velocity.",
    methodology:
      "Retired sets with at least 40% appreciation since retail EOL, minimum 100 secondary-market transactions per 90 days, retired at least 24 months ago. Weighted by appreciation percentage.",
    rebalanceNotes:
      "Q4 2024: Detective's Office (10246, +192%) remains the highest-weight constituent. Slave I (75060, +143%) added after sustained appreciation cross of 40% threshold. Colosseum (10276) watch-listed for potential addition.",
    constituentIds: ["10276", "10256", "75060", "10270", "10260", "10264", "10246", "21322", "75309"],
    delta1d: 0.08,
    delta7d: 0.62,
    delta30d: 1.89,
    delta1y: 8.4,
    launchYear: 2023,
    tone: "neutral",
  },
  {
    slug: "ideas",
    name: "Ideas Index",
    shortName: "IDEAX",
    tagline: "Fan-made. Market-approved.",
    description:
      "LEGO Ideas sets, equal-weighted. Ideas sets have historically outperformed on retirement due to limited print runs and passionate fan communities.",
    methodology:
      "All LEGO Ideas sets with secondary-market activity. Equal-weighted. Rebalanced quarterly. New sets added within 30 days of retail launch.",
    rebalanceNotes:
      "Q1 2025: Pirates of Barracuda Bay (21322) remains dominant at 34% weight due to exclusivity premium. Typewriter (21327) crossed 40% appreciation threshold. Starry Night (21333) watch-listed as potential breakout.",
    constituentIds: ["21322", "21336", "21338", "21327", "21325", "21333"],
    delta1d: 0.22,
    delta7d: 1.44,
    delta30d: 5.81,
    delta1y: 22.1,
    launchYear: 2023,
    tone: "cool",
  },
];

export const INDICES: MarketIndex[] = INDEX_DEFS.map((def, i) => {
  const drifts = [0.0006, 0.0009, 0.0004, 0.0003, 0.0008];
  const ends = randomWalk({ points: 730, start: 100, vol: 0.018, drift: drifts[i], seed: 10 + i });
  const currentValue = Number((ends[ends.length - 1].v * (150 + i * 30)).toFixed(2));
  const allTimeHigh = Number((currentValue * (1.04 + i * 0.02)).toFixed(2));
  return { ...def, currentValue, allTimeHigh };
});

export function indexHistory(
  slug: string,
  range: "1M" | "3M" | "1Y" | "3Y" | "ALL" = "1Y",
): DatedPoint[] {
  const idx = INDICES.findIndex((x) => x.slug === slug);
  if (idx < 0) return [];
  const drifts = [0.0006, 0.0009, 0.0004, 0.0003, 0.0008];
  const dayMap: Record<string, number> = { "1M": 30, "3M": 90, "1Y": 365, "3Y": 730, ALL: 1095 };
  const days = dayMap[range] ?? 365;
  return datedRandomWalk({ days, start: 100, vol: 0.018, drift: drifts[idx], seed: 10 + idx });
}

// ─── Constituents ─────────────────────────────────────────────────────────────

export function indexConstituents(slug: string): Array<CatalogSet & { weight: number; indexDelta1y: number }> {
  const idx = INDICES.find((x) => x.slug === slug);
  if (!idx) return [];
  return idx.constituentIds
    .map((id, i) => {
      const set = CATALOG_SETS.find((s) => s.id === id);
      if (!set) return null;
      return {
        ...set,
        weight: Number((100 / idx.constituentIds.length + ((i % 3) - 1) * 1.2).toFixed(1)),
        indexDelta1y: Number((set.appreciation / 5 + 2).toFixed(1)),
      };
    })
    .filter(Boolean) as Array<CatalogSet & { weight: number; indexDelta1y: number }>;
}

// ─── Biggest movers (daily) ───────────────────────────────────────────────────

export interface MoverEntry {
  set: CatalogSet;
  delta1d: number;
  volume: number;
  sparkline: SeriesPoint[];
}

export function biggestMovers(limit = 8): { gainers: MoverEntry[]; losers: MoverEntry[] } {
  const candidates = CATALOG_SETS.slice(0, 30);
  const tagged = candidates.map((set, i) => {
    const seed = parseInt(set.id, 10) % 10000 || i + 1;
    const pts = randomWalk({ points: 30, start: set.currentValue * 0.95, vol: 0.025, seed });
    const delta1d = Number((((Math.sin(seed * 0.37) + Math.cos(seed * 0.21)) * 2.8)).toFixed(2));
    return {
      set,
      delta1d,
      volume: 40 + (seed % 200),
      sparkline: pts,
    };
  });
  const sorted = [...tagged].sort((a, b) => b.delta1d - a.delta1d);
  return {
    gainers: sorted.slice(0, limit).filter((x) => x.delta1d > 0),
    losers: sorted.slice(-limit).filter((x) => x.delta1d < 0).reverse(),
  };
}

// ─── Trending ─────────────────────────────────────────────────────────────────

export type TrendPeriod = "7d" | "30d" | "90d";

export interface TrendRow {
  rank: number;
  set: CatalogSet;
  delta: number;
  deltaAbs: number;
  volume: number;
  sparkline: SeriesPoint[];
}

export function trendingGainers(period: TrendPeriod = "30d", limit = 15): TrendRow[] {
  const multiplier: Record<TrendPeriod, number> = { "7d": 0.35, "30d": 1, "90d": 2.8 };
  const m = multiplier[period];
  return CATALOG_SETS.map((set, i) => {
    const seed = parseInt(set.id, 10) % 10000 || i + 1;
    const delta = Number((set.pctChange30d * m + (seed % 5) * 0.3).toFixed(2));
    const pts = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    return {
      rank: 0,
      set,
      delta,
      deltaAbs: Number((set.currentValue * delta / 100).toFixed(0)),
      volume: 20 + (seed % 300),
      sparkline: randomWalk({ points: pts, start: set.currentValue * 0.9, vol: 0.022, drift: delta > 0 ? 0.002 : -0.001, seed }),
    };
  })
    .filter((r) => r.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, limit)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

export function trendingLosers(period: TrendPeriod = "30d", limit = 10): TrendRow[] {
  const multiplier: Record<TrendPeriod, number> = { "7d": 0.35, "30d": 1, "90d": 2.8 };
  const m = multiplier[period];
  return CATALOG_SETS.map((set, i) => {
    const seed = parseInt(set.id, 10) % 10000 || i + 1;
    const delta = Number((set.pctChange30d * m - (seed % 7) * 0.5 - 0.8).toFixed(2));
    const pts = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    return {
      rank: 0,
      set,
      delta,
      deltaAbs: Number((Math.abs(set.currentValue * delta / 100)).toFixed(0)),
      volume: 10 + (seed % 120),
      sparkline: randomWalk({ points: pts, start: set.currentValue * 1.05, vol: 0.022, drift: -0.002, seed: seed + 500 }),
    };
  })
    .filter((r) => r.delta < 0)
    .sort((a, b) => a.delta - b.delta)
    .slice(0, limit)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

// ─── Retiring Soon ────────────────────────────────────────────────────────────

export interface RetiringSoonEntry {
  set: CatalogSet;
  /** Estimated months until EOL (1–18). */
  monthsLeft: number;
  /** Historical avg appreciation at retirement for similar sets. */
  retirementAppreciation: number;
  /** Risk score: 0 (safe) – 100 (volatile). */
  riskScore: number;
  sparkline: SeriesPoint[];
}

export function retiringSoon(): RetiringSoonEntry[] {
  return CATALOG_SETS.filter((s) => s.status === "retiring-soon" || (s.status === "available" && s.appreciation < 20 && s.year <= 2021))
    .slice(0, 8)
    .map((set, i) => {
      const seed = parseInt(set.id, 10) % 10000 || i + 1;
      return {
        set,
        monthsLeft: 3 + (seed % 15),
        retirementAppreciation: 30 + (seed % 50),
        riskScore: 20 + (seed % 60),
        sparkline: randomWalk({ points: 60, start: set.msrp, vol: 0.015, drift: 0.001, seed }),
      };
    });
}

// ─── New Releases ─────────────────────────────────────────────────────────────

export interface NewReleaseEntry {
  set: CatalogSet;
  daysOnMarket: number;
  priceVsMsrp: number;
  /** First 30-day price series (starting at MSRP). */
  first30d: SeriesPoint[];
}

export function newReleases(): NewReleaseEntry[] {
  return CATALOG_SETS.filter((s) => s.year >= 2023 || (s.status === "available" && s.appreciation < 12))
    .slice(0, 8)
    .map((set, i) => {
      const seed = parseInt(set.id, 10) % 10000 || i + 1;
      const daysOnMarket = 15 + (seed % 60);
      const pts = randomWalk({
        points: Math.min(daysOnMarket, 30),
        start: set.msrp,
        vol: 0.018,
        drift: 0.0005,
        seed,
      });
      return {
        set,
        daysOnMarket,
        priceVsMsrp: Number((((set.currentValue - set.msrp) / set.msrp) * 100).toFixed(1)),
        first30d: pts,
      };
    });
}

// ─── News Feed ────────────────────────────────────────────────────────────────

export type NewsKind = "retirement" | "re-release" | "announcement" | "market" | "data";

export interface NewsItem {
  id: string;
  kind: NewsKind;
  headline: string;
  summary: string;
  date: string;
  setId?: string;
  setName?: string;
  impact?: "positive" | "negative" | "neutral";
}

export const NEWS_FEED: NewsItem[] = [
  {
    id: "n1",
    kind: "retirement",
    headline: "Assembly Square (10255) confirmed retiring Q3 2025",
    summary: "LEGO confirmed EOL for the long-running Modular. Secondary market has responded — 10255 up 12% in 48 hours.",
    date: "2025-04-10",
    setId: "10255",
    setName: "Assembly Square",
    impact: "positive",
  },
  {
    id: "n2",
    kind: "market",
    headline: "Ideas Index hits all-time high as Pirates of Barracuda Bay volume surges",
    summary: "21322 crossed $650 on BrickLink for the first time. Fan community speculation about a re-release is driving sell pressure — contrarian opportunity?",
    date: "2025-04-08",
    setId: "21322",
    setName: "Pirates of Barracuda Bay",
    impact: "positive",
  },
  {
    id: "n3",
    kind: "announcement",
    headline: "LEGO unveils 75400 The Mandalorian S4 Battle Pack",
    summary: "New Star Wars set announced at Fan Expo. Small set, but signals continued investment in Mando IP. Large UCS Mando set rumored for Q4.",
    date: "2025-04-06",
    impact: "neutral",
  },
  {
    id: "n4",
    kind: "data",
    headline: "BrickX 100 monthly rebalance: April 2025",
    summary: "Quarterly rebalance complete. 3 additions, 2 removals. Eiffel Tower increased weight to 3.8% on sustained volume growth. Full methodology note published.",
    date: "2025-04-01",
    impact: "neutral",
  },
  {
    id: "n5",
    kind: "re-release",
    headline: "Hogwarts Castle (71043) getting a 2.0 — existing sets drop 8%",
    summary: "Unconfirmed leak from LEGO insider suggests a refreshed Hogwarts Castle for Holiday 2025. Original 71043 down sharply. Treat with caution until official confirmation.",
    date: "2025-03-28",
    setId: "71043",
    setName: "Hogwarts Castle",
    impact: "negative",
  },
  {
    id: "n6",
    kind: "market",
    headline: "Modular Index posts best month since 2022 amid retirement wave",
    summary: "Assembly Square confirmation triggered renewed demand for the broader Modulars basket. MODX index +4.4% in March, best month in 28 months.",
    date: "2025-03-25",
    impact: "positive",
  },
  {
    id: "n7",
    kind: "retirement",
    headline: "NASA Apollo 11 Lunar Lander (10266) officially retired",
    summary: "LEGO has removed 10266 from official store. Secondary market inventory remains elevated — expected appreciation curve suggests 18-month horizon for significant gains.",
    date: "2025-03-18",
    setId: "10266",
    setName: "NASA Apollo 11 Lunar Lander",
    impact: "positive",
  },
  {
    id: "n8",
    kind: "announcement",
    headline: "LEGO 2026 Technic lineup leaked: two new supercar flagships",
    summary: "Images circulating on Reddit suggest a Ferrari and Porsche flagship for Technic in 2026. Existing Technic supercars showing early appreciation as collectors hedge.",
    date: "2025-03-12",
    impact: "positive",
  },
];

// ─── Theme Heatmap ─────────────────────────────────────────────────────────────

export interface HeatmapCell {
  theme: string;
  period: TrendPeriod;
  value: number;
}

const HEATMAP_THEMES = [
  "Star Wars", "Modular", "Harry Potter", "Ideas", "Technic", "Marvel", "Icons", "Art", "Creator Expert",
];

export function themeHeatmap(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  const periods: TrendPeriod[] = ["7d", "30d", "90d"];
  HEATMAP_THEMES.forEach((theme, ti) => {
    periods.forEach((period, pi) => {
      const seed = ti * 31 + pi * 7;
      const base = (Math.sin(seed * 0.9) * 4 + Math.cos(seed * 0.4) * 2);
      cells.push({ theme, period, value: Number(base.toFixed(2)) });
    });
  });
  return cells;
}

// ─── Sparkline for index (compact, 30 points) ─────────────────────────────────

export function indexSparkline(slug: string): SeriesPoint[] {
  const idx = INDICES.findIndex((x) => x.slug === slug);
  const drifts = [0.0006, 0.0009, 0.0004, 0.0003, 0.0008];
  return randomWalk({ points: 30, start: 100, vol: 0.018, drift: drifts[idx] ?? 0.0005, seed: 40 + idx });
}
