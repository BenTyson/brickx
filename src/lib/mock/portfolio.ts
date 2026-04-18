/**
 * Mock portfolio data for /demo/portfolio and /demo/collections/[id].
 * Deterministic — holdings are hand-picked from CATALOG_SETS; series are
 * derived with stable seeds. Server-safe, no DB.
 */

import {
  CATALOG_SETS,
  sparklineForSet,
  type CatalogSet,
} from "./catalog";
import {
  datedRandomWalk,
  type DatedPoint,
  type SeriesPoint,
} from "./series";

export interface Holding {
  set: CatalogSet;
  qty: number;
  costBasisPerUnit: number;
  purchaseDate: string;
  collectionId: string;
  sparkline30d: SeriesPoint[];
  delta30d: number;
  delta1y: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  tone: "brand" | "warm" | "cool" | "neutral";
  createdDate: string;
}

export interface WishlistItem {
  set: CatalogSet;
  targetPrice: number;
  addedDate: string;
  /** Target already hit or price within 5%. */
  dealDetected: boolean;
  sparkline: SeriesPoint[];
}

export interface ThemeAllocation {
  slug: string;
  name: string;
  value: number;
  costBasis: number;
  gain: number;
  gainPct: number;
  holdings: number;
  /** Contribution to month delta in $ (for attribution). */
  monthContribution: number;
}

export interface PortfolioSnapshot {
  totalValue: number;
  costBasis: number;
  gain: number;
  gainPct: number;
  itemCount: number;
  setCount: number;
  deltaToday: number;
  delta7d: number;
  delta30d: number;
  deltaAll: number;
}

export interface PortfolioHistoryRange {
  series: DatedPoint[];
  costBasisLine: number;
}

export type HistoryRangeKey = "1W" | "1M" | "3M" | "1Y" | "ALL";

/* ─── Collections ──────────────────────────────────────── */

export const COLLECTIONS: Collection[] = [
  {
    id: "flagships",
    name: "Flagships",
    description:
      "Grail-tier sets. Hold ten years and tell the grandkids about them.",
    tone: "brand",
    createdDate: "2021-03-14",
  },
  {
    id: "star-wars",
    name: "Star Wars",
    description: "UCS-heavy. The theme that made LEGO an asset class.",
    tone: "warm",
    createdDate: "2020-11-02",
  },
  {
    id: "modulars",
    name: "Modulars",
    description: "The blue-chip compounders. One per year, no exceptions.",
    tone: "cool",
    createdDate: "2019-06-18",
  },
  {
    id: "ideas",
    name: "Ideas & Oddities",
    description: "Fan-voted, limited-run. High variance, high conviction.",
    tone: "neutral",
    createdDate: "2022-01-07",
  },
];

/* ─── Holdings ─────────────────────────────────────────── */

interface HoldingSeed {
  id: string;
  qty: number;
  /** Multiplier applied to MSRP for cost basis. */
  costMult: number;
  /** Days ago purchased. */
  daysAgo: number;
  collectionId: string;
}

const HOLDING_SEEDS: HoldingSeed[] = [
  // Flagships
  { id: "10294", qty: 1, costMult: 1.0, daysAgo: 820, collectionId: "flagships" },
  { id: "10276", qty: 2, costMult: 0.93, daysAgo: 1200, collectionId: "flagships" },
  { id: "10307", qty: 1, costMult: 1.0, daysAgo: 540, collectionId: "flagships" },
  { id: "10256", qty: 1, costMult: 0.88, daysAgo: 1800, collectionId: "flagships" },
  { id: "10316", qty: 1, costMult: 1.0, daysAgo: 280, collectionId: "flagships" },

  // Star Wars
  { id: "75192", qty: 1, costMult: 0.95, daysAgo: 1700, collectionId: "star-wars" },
  { id: "75252", qty: 1, costMult: 0.92, daysAgo: 1500, collectionId: "star-wars" },
  { id: "75313", qty: 1, costMult: 1.0, daysAgo: 640, collectionId: "star-wars" },
  { id: "75309", qty: 1, costMult: 0.97, daysAgo: 890, collectionId: "star-wars" },
  { id: "75060", qty: 2, costMult: 0.7, daysAgo: 2600, collectionId: "star-wars" },
  { id: "75331", qty: 1, costMult: 1.0, daysAgo: 480, collectionId: "star-wars" },

  // Modulars
  { id: "10255", qty: 1, costMult: 0.94, daysAgo: 1900, collectionId: "modulars" },
  { id: "10270", qty: 1, costMult: 0.95, daysAgo: 1200, collectionId: "modulars" },
  { id: "10297", qty: 1, costMult: 1.0, daysAgo: 620, collectionId: "modulars" },
  { id: "10260", qty: 1, costMult: 0.91, daysAgo: 2300, collectionId: "modulars" },
  { id: "10278", qty: 1, costMult: 1.0, daysAgo: 900, collectionId: "modulars" },
  { id: "10264", qty: 1, costMult: 0.93, daysAgo: 1700, collectionId: "modulars" },

  // Ideas & Oddities
  { id: "21322", qty: 1, costMult: 1.0, daysAgo: 1300, collectionId: "ideas" },
  { id: "21336", qty: 1, costMult: 1.0, daysAgo: 430, collectionId: "ideas" },
  { id: "21325", qty: 1, costMult: 0.97, daysAgo: 1100, collectionId: "ideas" },
  { id: "21327", qty: 1, costMult: 0.98, daysAgo: 820, collectionId: "ideas" },
];

function fmtDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function findSet(id: string): CatalogSet {
  const s = CATALOG_SETS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown set id in holding seed: ${id}`);
  return s;
}

function hashCode(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const HOLDINGS: Holding[] = HOLDING_SEEDS.map((seed) => {
  const set = findSet(seed.id);
  const costBasisPerUnit = Number((set.msrp * seed.costMult).toFixed(2));
  // 1Y delta: inferred from total appreciation over yearsSince.
  const yearsSince = Math.max(
    (new Date().getFullYear() - set.year) + seed.daysAgo / 365,
    0.25,
  );
  // Portion of total return that occurred in the past year (flat assumption).
  const delta1y = Number(
    (set.appreciation / Math.max(yearsSince, 1)).toFixed(2),
  );
  return {
    set,
    qty: seed.qty,
    costBasisPerUnit,
    purchaseDate: fmtDateDaysAgo(seed.daysAgo),
    collectionId: seed.collectionId,
    sparkline30d: sparklineForSet(set, 30),
    delta30d: set.pctChange30d,
    delta1y,
  };
});

/* ─── Aggregates ───────────────────────────────────────── */

export function portfolioSnapshot(
  holdings: Holding[] = HOLDINGS,
): PortfolioSnapshot {
  let totalValue = 0;
  let costBasis = 0;
  let itemCount = 0;
  let todayDollars = 0;
  let weekDollars = 0;
  let monthDollars = 0;
  for (const h of holdings) {
    const mkt = h.set.currentValue * h.qty;
    totalValue += mkt;
    costBasis += h.costBasisPerUnit * h.qty;
    itemCount += h.qty;
    // derived daily/weekly deltas — a fraction of month delta
    monthDollars += (h.set.pctChange30d / 100) * mkt;
    weekDollars += (h.set.pctChange30d / 100 / 4) * mkt;
    todayDollars += (h.set.pctChange30d / 100 / 30) * mkt;
  }
  const gain = totalValue - costBasis;
  const gainPct = costBasis > 0 ? (gain / costBasis) * 100 : 0;
  return {
    totalValue: Number(totalValue.toFixed(2)),
    costBasis: Number(costBasis.toFixed(2)),
    gain: Number(gain.toFixed(2)),
    gainPct: Number(gainPct.toFixed(2)),
    itemCount,
    setCount: holdings.length,
    deltaToday: Number(((todayDollars / totalValue) * 100).toFixed(2)),
    delta7d: Number(((weekDollars / totalValue) * 100).toFixed(2)),
    delta30d: Number(((monthDollars / totalValue) * 100).toFixed(2)),
    deltaAll: Number(gainPct.toFixed(2)),
  };
}

export function themeAllocations(
  holdings: Holding[] = HOLDINGS,
): ThemeAllocation[] {
  const byTheme = new Map<
    string,
    {
      slug: string;
      name: string;
      value: number;
      cost: number;
      holdings: number;
      monthContribution: number;
    }
  >();
  for (const h of holdings) {
    const key = h.set.themeSlug;
    const curr = byTheme.get(key) ?? {
      slug: key,
      name: h.set.theme,
      value: 0,
      cost: 0,
      holdings: 0,
      monthContribution: 0,
    };
    const mkt = h.set.currentValue * h.qty;
    curr.value += mkt;
    curr.cost += h.costBasisPerUnit * h.qty;
    curr.holdings += h.qty;
    curr.monthContribution += (h.set.pctChange30d / 100) * mkt;
    byTheme.set(key, curr);
  }
  return [...byTheme.values()]
    .map((t) => {
      const gain = t.value - t.cost;
      return {
        slug: t.slug,
        name: t.name,
        value: Number(t.value.toFixed(2)),
        costBasis: Number(t.cost.toFixed(2)),
        gain: Number(gain.toFixed(2)),
        gainPct: t.cost > 0 ? Number(((gain / t.cost) * 100).toFixed(2)) : 0,
        holdings: t.holdings,
        monthContribution: Number(t.monthContribution.toFixed(2)),
      };
    })
    .sort((a, b) => b.value - a.value);
}

/* ─── History ──────────────────────────────────────────── */

const RANGE_DAYS: Record<HistoryRangeKey, number> = {
  "1W": 7,
  "1M": 30,
  "3M": 90,
  "1Y": 365,
  ALL: 1200,
};

export function portfolioHistory(
  range: HistoryRangeKey,
  snapshot: PortfolioSnapshot = portfolioSnapshot(),
): PortfolioHistoryRange {
  const days = RANGE_DAYS[range];
  // Back out a starting value: recent ranges start close to current; ALL
  // starts around cost basis so the upward drift lines up with appreciation.
  const endValue = snapshot.totalValue;
  let start: number;
  let vol: number;
  let drift: number;
  let seed: number;
  switch (range) {
    case "1W":
      start = endValue / (1 + snapshot.delta7d / 100);
      vol = 0.012;
      drift = snapshot.delta7d / 100 / days;
      seed = 91;
      break;
    case "1M":
      start = endValue / (1 + snapshot.delta30d / 100);
      vol = 0.014;
      drift = snapshot.delta30d / 100 / days;
      seed = 211;
      break;
    case "3M":
      start = endValue / (1 + (snapshot.delta30d * 2.4) / 100);
      vol = 0.016;
      drift = (snapshot.delta30d * 2.4) / 100 / days;
      seed = 347;
      break;
    case "1Y":
      start = endValue * 0.82;
      vol = 0.018;
      drift = 0.22 / days;
      seed = 503;
      break;
    case "ALL":
    default:
      start = snapshot.costBasis * 0.96;
      vol = 0.02;
      drift = Math.log(endValue / start) / days;
      seed = 719;
      break;
  }
  const raw = datedRandomWalk({ days, start, vol, drift, seed });
  // Normalize last point to exactly equal endValue so stat and chart agree.
  const scale = endValue / raw[raw.length - 1].v;
  const series = raw.map((p) => ({ date: p.date, v: Number((p.v * scale).toFixed(2)) }));
  return {
    series,
    costBasisLine: snapshot.costBasis,
  };
}

/* ─── Top movers ───────────────────────────────────────── */

export interface MoverRow {
  holding: Holding;
  changeDollars: number;
  changePct: number;
}

export function topMovers(
  holdings: Holding[] = HOLDINGS,
  limit = 5,
): { gainers: MoverRow[]; losers: MoverRow[] } {
  const rows: MoverRow[] = holdings.map((h) => {
    const mkt = h.set.currentValue * h.qty;
    const changePct = h.set.pctChange30d;
    const changeDollars = (changePct / 100) * mkt;
    return { holding: h, changeDollars, changePct };
  });
  const gainers = [...rows]
    .filter((r) => r.changePct > 0)
    .sort((a, b) => b.changeDollars - a.changeDollars)
    .slice(0, limit);
  const losers = [...rows]
    .filter((r) => r.changePct < 0)
    .sort((a, b) => a.changeDollars - b.changeDollars)
    .slice(0, limit);
  return { gainers, losers };
}

/* ─── Wishlist ─────────────────────────────────────────── */

const WISHLIST_SEEDS: Array<{ id: string; targetPct: number; daysAgo: number }> = [
  // targetPct < 100 ⇒ target below current (want a dip). >100 ⇒ already hit.
  { id: "42143", targetPct: 0.92, daysAgo: 45 },
  { id: "76269", targetPct: 0.9, daysAgo: 20 },
  { id: "75367", targetPct: 0.96, daysAgo: 60 },
  { id: "21338", targetPct: 1.04, daysAgo: 14 }, // deal — current < target
  { id: "10305", targetPct: 0.94, daysAgo: 90 },
  { id: "31205", targetPct: 1.02, daysAgo: 8 },
  { id: "76405", targetPct: 0.95, daysAgo: 120 },
  { id: "21333", targetPct: 1.05, daysAgo: 35 },
];

export const WISHLIST: WishlistItem[] = WISHLIST_SEEDS.map((seed) => {
  const set = findSet(seed.id);
  const targetPrice = Number((set.currentValue * seed.targetPct).toFixed(2));
  const within5 = set.currentValue <= targetPrice * 1.05;
  return {
    set,
    targetPrice,
    addedDate: fmtDateDaysAgo(seed.daysAgo),
    dealDetected: within5,
    sparkline: sparklineForSet(set, 45),
  };
});

/* ─── Scatter (risk/return) ────────────────────────────── */

export interface RiskReturnPoint {
  id: string;
  name: string;
  theme: string;
  volatility: number; // pct
  returnPct: number; // %
  value: number; // $ market value (point size)
}

export function riskReturnSeries(
  holdings: Holding[] = HOLDINGS,
): RiskReturnPoint[] {
  return holdings.map((h) => {
    const seed = hashCode(h.set.id);
    const vol = 8 + (seed % 2400) / 120; // 8–28%
    const ret = (h.set.currentValue - h.costBasisPerUnit) /
      Math.max(h.costBasisPerUnit, 1) * 100;
    return {
      id: h.set.id,
      name: h.set.name,
      theme: h.set.theme,
      volatility: Number(vol.toFixed(1)),
      returnPct: Number(ret.toFixed(1)),
      value: h.set.currentValue * h.qty,
    };
  });
}

/* ─── Collection-scoped views ──────────────────────────── */

export function findCollection(id: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.id === id);
}

export function holdingsInCollection(id: string): Holding[] {
  return HOLDINGS.filter((h) => h.collectionId === id);
}

/* ─── Theme gradient tone → chart color ────────────────── */

export const TONE_COLOR: Record<ThemeAllocation["slug"] | string, string> = {
  "creator-expert": "var(--accent)",
  "star-wars": "var(--warning)",
  modular: "var(--info)",
  ideas: "var(--success)",
  technic: "var(--danger)",
  icons: "var(--accent-hover)",
  "harry-potter": "#E879F9",
  marvel: "#F97316",
  art: "#94A3B8",
};

export function themeColor(slug: string): string {
  return TONE_COLOR[slug] ?? "var(--text-tertiary)";
}

/* ─── Sample per-holding 1Y series for attribution ─────── */

export function holdingHistorySeries(
  h: Holding,
  days = 365,
): DatedPoint[] {
  const seed = hashCode(`${h.set.id}:${h.collectionId}`);
  const start = h.costBasisPerUnit;
  const end = h.set.currentValue;
  const drift = Math.log(end / Math.max(start, 1)) / days;
  const raw = datedRandomWalk({ days, start, vol: 0.018, drift, seed });
  const scale = end / raw[raw.length - 1].v;
  return raw.map((p) => ({ date: p.date, v: Number((p.v * scale).toFixed(2)) }));
}

/* ─── 90-day series for wishlist sparklines with target ─ */

export function wishlistSparkline(w: WishlistItem): SeriesPoint[] {
  return w.sparkline;
}
