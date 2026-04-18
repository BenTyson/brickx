/**
 * Mock detail-page data for /demo/sets/[id].
 * Derives from CATALOG_SETS and produces deterministic series + key stats,
 * source-broken price history, related/correlated sets, and event annotations.
 * Server-safe — no DB, zero side effects.
 */

import {
  CATALOG_SETS,
  sparklineForSet,
  type CatalogSet,
} from "./catalog";
import {
  datedRandomWalk,
  type DatedPoint,
  type PriceChartEvent,
  type SeriesPoint,
} from "./series";

export interface SetDetailKeyStats {
  lastSale: number;
  high30d: number;
  low30d: number;
  volume30d: number;
  volatility: number; // annualized stdev, percent
}

export interface SetDetailFundamentals {
  msrp: number;
  parts: number;
  minifigs: number;
  pricePerPart: number; // current $/part
  msrpPerPart: number;
  cagr: number; // % since release
  yearsSinceRelease: number;
  projectedRetirement: string | null; // ISO yyyy or null
}

export interface SetDetailIndexMembership {
  slug: string;
  name: string;
  tone: "brand" | "warm" | "cool" | "neutral";
  weight?: number; // % of index
}

export interface SetDetailImage {
  url: string | null;
  alt: string;
  caption?: string;
}

export interface RelatedSet {
  id: string;
  name: string;
  theme: string;
  year: number;
  status: CatalogSet["status"];
  imgUrl?: string | null;
  msrp: number;
  currentValue: number;
  pctChange30d: number;
  sparkline: SeriesPoint[];
}

export interface CorrelatedSet {
  id: string;
  name: string;
  theme: string;
  correlation: number; // -1..1
  sparkline: SeriesPoint[];
  pctChange30d: number;
}

export interface SetDetailMock {
  set: CatalogSet;
  bid: number;
  ask: number;
  delta30d: number;
  delta1y: number;
  images: SetDetailImage[];
  keyStats: SetDetailKeyStats;
  fundamentals: SetDetailFundamentals;
  indices: SetDetailIndexMembership[];
  /** Headline new-condition series, ALL range. */
  priceSeries: DatedPoint[];
  usedSeries: DatedPoint[];
  sources: {
    bricklink: DatedPoint[];
    brickowl: DatedPoint[];
    brickeconomy: DatedPoint[];
  };
  events: PriceChartEvent[];
  related: RelatedSet[];
  correlated: CorrelatedSet[];
}

function hashCode(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function findSet(id: string): CatalogSet | undefined {
  return CATALOG_SETS.find((s) => s.id === id);
}

const INDEX_POOL: SetDetailIndexMembership[] = [
  { slug: "brickx-100", name: "BrickX 100", tone: "brand" },
  { slug: "star-wars-heat", name: "Star Wars Heat", tone: "warm" },
  { slug: "modulars", name: "Modulars", tone: "cool" },
  { slug: "retired-gold", name: "Retired Gold", tone: "neutral" },
  { slug: "ideas-vault", name: "Ideas Vault", tone: "brand" },
  { slug: "creator-flagships", name: "Creator Flagships", tone: "cool" },
  { slug: "technic-hypercars", name: "Technic Hypercars", tone: "warm" },
];

function membershipFor(set: CatalogSet): SetDetailIndexMembership[] {
  const out: SetDetailIndexMembership[] = [];
  // Always BrickX 100 for the top movers
  if (Math.abs(set.pctChange30d) >= 1 || set.appreciation > 30) {
    out.push({ ...INDEX_POOL[0], weight: 0.6 + (hashCode(set.id) % 100) / 100 });
  }
  switch (set.themeSlug) {
    case "star-wars":
      out.push(INDEX_POOL[1]);
      break;
    case "modular":
      out.push(INDEX_POOL[2]);
      break;
    case "creator-expert":
      out.push(INDEX_POOL[5]);
      break;
    case "technic":
      out.push(INDEX_POOL[6]);
      break;
    case "ideas":
      out.push(INDEX_POOL[4]);
      break;
  }
  if (set.status === "retired") {
    out.push(INDEX_POOL[3]);
  }
  return out;
}

function buildImages(set: CatalogSet): SetDetailImage[] {
  // Mock multi-angle by reusing the primary image; null falls back to the
  // brick placeholder rendered by SetImageGallery.
  const primary = set.imgUrl ?? null;
  return [
    { url: primary, alt: `${set.name} — front`, caption: "Front" },
    { url: primary, alt: `${set.name} — angle`, caption: "Angle" },
    { url: primary, alt: `${set.name} — back`, caption: "Back" },
    { url: primary, alt: `${set.name} — packaging`, caption: "Box" },
  ];
}

function buildEvents(set: CatalogSet): PriceChartEvent[] {
  const out: PriceChartEvent[] = [];
  const today = new Date();
  // Anchor "release" near the year start.
  const releaseDate = new Date(set.year, 0, 15).toISOString().slice(0, 10);
  out.push({ date: releaseDate, label: "Release", kind: "announcement" });
  if (set.status === "retired" || set.status === "retiring-soon") {
    const retireYear = Math.min(set.year + 3, today.getFullYear() - 1);
    if (retireYear > set.year) {
      out.push({
        date: new Date(retireYear, 9, 1).toISOString().slice(0, 10),
        label: set.status === "retired" ? "Retired" : "EOL announced",
        kind: "retirement",
      });
    }
  }
  // Add a re-release / restock event for the most-traded examples.
  if (set.id === "10256" || set.id === "75192") {
    out.push({
      date: new Date(set.year + 4, 4, 12).toISOString().slice(0, 10),
      label: "Limited restock",
      kind: "re-release",
    });
  }
  return out;
}

function buildKeyStats(
  set: CatalogSet,
  series: DatedPoint[],
): SetDetailKeyStats {
  const last30 = series.slice(-30);
  const last = last30.length ? last30[last30.length - 1].v : set.currentValue;
  const high = Math.max(...last30.map((p) => p.v));
  const low = Math.min(...last30.map((p) => p.v));
  const seed = hashCode(set.id);
  const baseVol = 0.012 + (seed % 24) / 1000;
  const annualizedVol = baseVol * Math.sqrt(252) * 100;
  const volume = 12 + (seed % 380); // arbitrary sells/30d
  return {
    lastSale: Number(last.toFixed(2)),
    high30d: Number(high.toFixed(2)),
    low30d: Number(low.toFixed(2)),
    volume30d: volume,
    volatility: Number(annualizedVol.toFixed(1)),
  };
}

function buildFundamentals(set: CatalogSet): SetDetailFundamentals {
  const today = new Date();
  const yearsSince = Math.max(today.getFullYear() - set.year, 0.1);
  const ratio = set.currentValue / Math.max(set.msrp, 1);
  const cagr = (Math.pow(ratio, 1 / yearsSince) - 1) * 100;
  return {
    msrp: set.msrp,
    parts: set.parts,
    minifigs: set.minifigs,
    pricePerPart: set.parts > 0 ? set.currentValue / set.parts : 0,
    msrpPerPart: set.parts > 0 ? set.msrp / set.parts : 0,
    cagr: Number(cagr.toFixed(1)),
    yearsSinceRelease: Number(yearsSince.toFixed(1)),
    projectedRetirement:
      set.status === "available"
        ? `${set.year + 4}`
        : set.status === "retiring-soon"
          ? "next 6 months"
          : null,
  };
}

function buildRelated(set: CatalogSet): RelatedSet[] {
  return CATALOG_SETS.filter(
    (s) => s.themeSlug === set.themeSlug && s.id !== set.id,
  )
    .slice(0, 8)
    .map((s) => ({
      id: s.id,
      name: s.name,
      theme: s.theme,
      year: s.year,
      status: s.status,
      imgUrl: s.imgUrl,
      msrp: s.msrp,
      currentValue: s.currentValue,
      pctChange30d: s.pctChange30d,
      sparkline: sparklineForSet(s, 45),
    }));
}

function buildCorrelated(set: CatalogSet): CorrelatedSet[] {
  // Pick six others — prefer same status, biased by similar appreciation.
  const others = CATALOG_SETS.filter((s) => s.id !== set.id)
    .map((s) => ({
      s,
      score:
        (s.themeSlug === set.themeSlug ? 0.4 : 0) +
        (s.status === set.status ? 0.3 : 0) -
        Math.abs(s.appreciation - set.appreciation) / 200,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ s }, i) => {
      const seed = hashCode(set.id + s.id);
      // Deterministic correlation in 0.45–0.92 range
      const corr = 0.45 + ((seed % 470) / 1000);
      return {
        id: s.id,
        name: s.name,
        theme: s.theme,
        correlation: Number(corr.toFixed(2)) * (i % 6 === 5 ? -1 : 1),
        sparkline: sparklineForSet(s, 60),
        pctChange30d: s.pctChange30d,
      } satisfies CorrelatedSet;
    });
  return others.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
}

export function listMockDetailIds(): string[] {
  return CATALOG_SETS.map((s) => s.id);
}

export function getMockSetDetail(id: string): SetDetailMock | null {
  const set = findSet(id);
  if (!set) return null;
  const seed = hashCode(set.id);
  const days = 540; // ~18 months of history
  const drift = set.appreciation / 100 / days;
  const vol = 0.012 + Math.abs(set.pctChange30d) / 600;
  const start = set.currentValue / Math.pow(1 + drift, days);
  const newSeries = datedRandomWalk({ days, start, vol, drift, seed });
  const usedAnchor = set.currentValue * 0.78;
  const usedSeries = datedRandomWalk({
    days,
    start: usedAnchor / Math.pow(1 + drift * 0.85, days),
    vol: vol * 1.15,
    drift: drift * 0.85,
    seed: seed + 13,
  });
  const sources = {
    bricklink: datedRandomWalk({
      days,
      start: start * 1.04,
      vol: vol * 1.05,
      drift,
      seed: seed + 41,
    }),
    brickowl: datedRandomWalk({
      days,
      start: start * 0.97,
      vol: vol * 0.95,
      drift,
      seed: seed + 71,
    }),
    brickeconomy: datedRandomWalk({
      days,
      start: start * 1.0,
      vol: vol * 0.9,
      drift,
      seed: seed + 109,
    }),
  };
  const last = newSeries[newSeries.length - 1].v;
  const last30Idx = Math.max(0, newSeries.length - 30);
  const last1yIdx = Math.max(0, newSeries.length - 365);
  const delta30d = ((last - newSeries[last30Idx].v) / newSeries[last30Idx].v) * 100;
  const delta1y = ((last - newSeries[last1yIdx].v) / newSeries[last1yIdx].v) * 100;

  // Bid/ask spread tightens on liquid (large-volume) sets.
  const baseSpread = 0.06 + ((seed % 40) / 1000);
  const bid = last * (1 - baseSpread / 2);
  const ask = last * (1 + baseSpread / 2);

  return {
    set,
    bid: Number(bid.toFixed(2)),
    ask: Number(ask.toFixed(2)),
    delta30d: Number(delta30d.toFixed(2)),
    delta1y: Number(delta1y.toFixed(2)),
    images: buildImages(set),
    keyStats: buildKeyStats(set, newSeries),
    fundamentals: buildFundamentals(set),
    indices: membershipFor(set),
    priceSeries: newSeries,
    usedSeries,
    sources,
    events: buildEvents(set),
    related: buildRelated(set),
    correlated: buildCorrelated(set),
  };
}

