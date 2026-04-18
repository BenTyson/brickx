/**
 * Mock catalog data for /demo/sets and /demo/themes.
 * Hardcoded seed list across ~10 themes; deterministic sparkline generators
 * tied to set ID so charts are stable across renders. Zero DB access — demo only.
 */

import { randomWalk, type SeriesPoint } from "./series";

export type SetStatus =
  | "available"
  | "retired"
  | "retiring-soon"
  | "exclusive"
  | "unreleased";

export interface CatalogSet {
  id: string;
  name: string;
  theme: string;
  themeSlug: string;
  year: number;
  status: SetStatus;
  imgUrl?: string | null;
  msrp: number;
  currentValue: number;
  pctChange30d: number;
  parts: number;
  minifigs: number;
  /** 0–100 appreciation since release */
  appreciation: number;
}

export interface Theme {
  slug: string;
  name: string;
  tagline: string;
  setCount: number;
  avgAppreciation: number;
  heroSetId: string;
  pinned?: boolean;
  tone: "brand" | "warm" | "cool" | "neutral";
}

/* ── Sets ─────────────────────────────────────────────────────── */

const RAW_SETS: Array<Omit<CatalogSet, "themeSlug">> = [
  { id: "10294", name: "Titanic", theme: "Creator Expert", year: 2021, status: "available", msrp: 629.99, currentValue: 684, pctChange30d: 12.4, parts: 9090, minifigs: 0, appreciation: 8.6 },
  { id: "10276", name: "Colosseum", theme: "Creator Expert", year: 2020, status: "retired", msrp: 549.99, currentValue: 812, pctChange30d: 6.3, parts: 9036, minifigs: 0, appreciation: 47.6 },
  { id: "10307", name: "Eiffel Tower", theme: "Icons", year: 2022, status: "available", msrp: 629.99, currentValue: 698, pctChange30d: 3.1, parts: 10001, minifigs: 0, appreciation: 10.8 },
  { id: "10256", name: "Taj Mahal", theme: "Icons", year: 2017, status: "retired", msrp: 369.99, currentValue: 520, pctChange30d: 1.9, parts: 5923, minifigs: 0, appreciation: 40.5 },

  { id: "75192", name: "Millennium Falcon Ultimate Collector Series", theme: "Star Wars", year: 2017, status: "retired", msrp: 799.99, currentValue: 982, pctChange30d: 4.1, parts: 7541, minifigs: 10, appreciation: 22.8 },
  { id: "75313", name: "AT-AT Ultimate Collector Series", theme: "Star Wars", year: 2021, status: "available", msrp: 799.99, currentValue: 846, pctChange30d: -1.2, parts: 6785, minifigs: 9, appreciation: 5.7 },
  { id: "75252", name: "Imperial Star Destroyer", theme: "Star Wars", year: 2019, status: "retired", msrp: 699.99, currentValue: 874, pctChange30d: 2.4, parts: 4784, minifigs: 2, appreciation: 24.8 },
  { id: "75331", name: "The Razor Crest", theme: "Star Wars", year: 2022, status: "available", msrp: 599.99, currentValue: 612, pctChange30d: 0.4, parts: 6187, minifigs: 5, appreciation: 2.0 },
  { id: "75060", name: "Slave I", theme: "Star Wars", year: 2015, status: "retired", msrp: 199.99, currentValue: 486, pctChange30d: 5.6, parts: 1996, minifigs: 4, appreciation: 143.0 },

  { id: "10255", name: "Assembly Square", theme: "Modular", year: 2017, status: "retiring-soon", msrp: 279.99, currentValue: 412, pctChange30d: -2.8, parts: 4002, minifigs: 8, appreciation: 47.1 },
  { id: "10297", name: "Boutique Hotel", theme: "Modular", year: 2022, status: "available", msrp: 229.99, currentValue: 318, pctChange30d: 1.7, parts: 3066, minifigs: 7, appreciation: 38.3 },
  { id: "10270", name: "Bookshop", theme: "Modular", year: 2020, status: "retired", msrp: 179.99, currentValue: 329, pctChange30d: 4.2, parts: 2504, minifigs: 5, appreciation: 82.8 },
  { id: "10278", name: "Police Station", theme: "Modular", year: 2021, status: "available", msrp: 199.99, currentValue: 268, pctChange30d: 0.8, parts: 2923, minifigs: 6, appreciation: 34.0 },
  { id: "10260", name: "Downtown Diner", theme: "Modular", year: 2018, status: "retired", msrp: 169.99, currentValue: 298, pctChange30d: 2.6, parts: 2480, minifigs: 6, appreciation: 75.3 },

  { id: "21322", name: "Pirates of Barracuda Bay", theme: "Ideas", year: 2020, status: "exclusive", msrp: 199.99, currentValue: 620, pctChange30d: 18.5, parts: 2545, minifigs: 6, appreciation: 210.0 },
  { id: "21336", name: "The Office", theme: "Ideas", year: 2022, status: "available", msrp: 119.99, currentValue: 164, pctChange30d: 3.8, parts: 1164, minifigs: 15, appreciation: 36.6 },
  { id: "21338", name: "A-frame Cabin", theme: "Ideas", year: 2023, status: "available", msrp: 179.99, currentValue: 194, pctChange30d: 1.2, parts: 2082, minifigs: 4, appreciation: 7.8 },
  { id: "21327", name: "Typewriter", theme: "Ideas", year: 2021, status: "retired", msrp: 199.99, currentValue: 286, pctChange30d: 2.0, parts: 2079, minifigs: 0, appreciation: 43.0 },

  { id: "42115", name: "Lamborghini Sián FKP 37", theme: "Technic", year: 2020, status: "available", msrp: 379.99, currentValue: 488, pctChange30d: 8.9, parts: 3696, minifigs: 0, appreciation: 28.4 },
  { id: "42083", name: "Bugatti Chiron", theme: "Technic", year: 2018, status: "retired", msrp: 349.99, currentValue: 498, pctChange30d: 3.2, parts: 3599, minifigs: 0, appreciation: 42.3 },
  { id: "42143", name: "Ferrari Daytona SP3", theme: "Technic", year: 2022, status: "available", msrp: 449.99, currentValue: 528, pctChange30d: 4.8, parts: 3778, minifigs: 0, appreciation: 17.3 },
  { id: "42141", name: "McLaren Formula 1", theme: "Technic", year: 2022, status: "available", msrp: 199.99, currentValue: 224, pctChange30d: 1.1, parts: 1432, minifigs: 0, appreciation: 12.0 },

  { id: "71043", name: "Hogwarts Castle", theme: "Harry Potter", year: 2018, status: "retiring-soon", msrp: 399.99, currentValue: 612, pctChange30d: 6.2, parts: 6020, minifigs: 4, appreciation: 53.0 },
  { id: "76391", name: "Hogwarts Icons", theme: "Harry Potter", year: 2021, status: "retired", msrp: 249.99, currentValue: 328, pctChange30d: 2.1, parts: 3010, minifigs: 2, appreciation: 31.2 },
  { id: "75978", name: "Diagon Alley", theme: "Harry Potter", year: 2020, status: "retiring-soon", msrp: 399.99, currentValue: 548, pctChange30d: 4.4, parts: 5544, minifigs: 14, appreciation: 37.0 },

  { id: "76269", name: "Avengers Tower", theme: "Marvel", year: 2023, status: "available", msrp: 499.99, currentValue: 534, pctChange30d: 2.3, parts: 5201, minifigs: 31, appreciation: 7.0 },
  { id: "76210", name: "Hulkbuster", theme: "Marvel", year: 2022, status: "available", msrp: 549.99, currentValue: 612, pctChange30d: 3.4, parts: 4049, minifigs: 0, appreciation: 11.3 },
  { id: "76218", name: "Sanctum Sanctorum", theme: "Marvel", year: 2022, status: "available", msrp: 249.99, currentValue: 284, pctChange30d: 1.6, parts: 2708, minifigs: 9, appreciation: 13.6 },

  { id: "10264", name: "Corner Garage", theme: "Modular", year: 2019, status: "retired", msrp: 199.99, currentValue: 342, pctChange30d: 2.0, parts: 2569, minifigs: 6, appreciation: 71.0 },
  { id: "10246", name: "Detective's Office", theme: "Modular", year: 2015, status: "retired", msrp: 159.99, currentValue: 468, pctChange30d: 1.4, parts: 2262, minifigs: 6, appreciation: 192.5 },

  { id: "10283", name: "NASA Space Shuttle Discovery", theme: "Icons", year: 2021, status: "available", msrp: 199.99, currentValue: 236, pctChange30d: 1.8, parts: 2354, minifigs: 0, appreciation: 18.0 },
  { id: "10266", name: "NASA Apollo 11 Lunar Lander", theme: "Icons", year: 2019, status: "retired", msrp: 99.99, currentValue: 178, pctChange30d: 2.9, parts: 1087, minifigs: 2, appreciation: 78.0 },

  { id: "10316", name: "The Lord of the Rings: Rivendell", theme: "Icons", year: 2023, status: "available", msrp: 499.99, currentValue: 548, pctChange30d: 3.6, parts: 6167, minifigs: 15, appreciation: 9.8 },
  { id: "10305", name: "Lion Knights' Castle", theme: "Icons", year: 2022, status: "available", msrp: 399.99, currentValue: 462, pctChange30d: 2.7, parts: 4514, minifigs: 22, appreciation: 15.5 },

  { id: "76989", name: "Horizon Forbidden West: Tallneck", theme: "Icons", year: 2022, status: "retired", msrp: 79.99, currentValue: 132, pctChange30d: 4.1, parts: 1222, minifigs: 1, appreciation: 65.0 },

  { id: "31203", name: "World Map", theme: "Art", year: 2021, status: "retiring-soon", msrp: 249.99, currentValue: 298, pctChange30d: -0.6, parts: 11695, minifigs: 0, appreciation: 19.2 },
  { id: "31205", name: "Jim Lee Batman Collection", theme: "Art", year: 2022, status: "available", msrp: 129.99, currentValue: 142, pctChange30d: 0.9, parts: 4167, minifigs: 0, appreciation: 9.2 },

  { id: "21325", name: "Medieval Blacksmith", theme: "Ideas", year: 2021, status: "retired", msrp: 149.99, currentValue: 268, pctChange30d: 3.7, parts: 2164, minifigs: 4, appreciation: 78.7 },
  { id: "21333", name: "Vincent van Gogh — The Starry Night", theme: "Ideas", year: 2022, status: "available", msrp: 169.99, currentValue: 184, pctChange30d: 1.1, parts: 2316, minifigs: 1, appreciation: 8.2 },

  { id: "75309", name: "Republic Gunship", theme: "Star Wars", year: 2021, status: "retired", msrp: 349.99, currentValue: 678, pctChange30d: 6.8, parts: 3292, minifigs: 5, appreciation: 93.7 },
  { id: "75367", name: "Venator-Class Republic Attack Cruiser", theme: "Star Wars", year: 2023, status: "available", msrp: 649.99, currentValue: 698, pctChange30d: 2.1, parts: 5374, minifigs: 4, appreciation: 7.4 },

  { id: "76405", name: "Hogwarts Express — Collectors' Edition", theme: "Harry Potter", year: 2022, status: "available", msrp: 499.99, currentValue: 548, pctChange30d: 1.4, parts: 5129, minifigs: 5, appreciation: 9.8 },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const CATALOG_SETS: CatalogSet[] = RAW_SETS.map((s) => ({
  ...s,
  themeSlug: slugify(s.theme),
}));

/* ── Themes (derived + curated tone/tagline) ──────────────────── */

const THEME_META: Record<
  string,
  { tagline: string; tone: Theme["tone"]; pinned?: boolean }
> = {
  "creator-expert": {
    tagline: "The blue-chip builds. Dense, large-piece, adult-targeted.",
    tone: "brand",
    pinned: true,
  },
  icons: {
    tagline: "Landmark sets — architecture, vehicles, pop culture.",
    tone: "cool",
    pinned: true,
  },
  "star-wars": {
    tagline: "The theme that made LEGO an asset class.",
    tone: "warm",
    pinned: true,
  },
  modular: {
    tagline: "Low-volatility compounders. The BrickX blue chip.",
    tone: "cool",
    pinned: true,
  },
  ideas: {
    tagline: "Fan-voted, limited-run. Retires fast, appreciates faster.",
    tone: "brand",
  },
  technic: {
    tagline: "Mechanical flagships. Licensed hypercars dominate.",
    tone: "neutral",
  },
  "harry-potter": {
    tagline: "Castle-class sets with strong retirement pop.",
    tone: "warm",
  },
  marvel: {
    tagline: "Growing fast — recent releases skew younger.",
    tone: "neutral",
  },
  art: { tagline: "Wall-mountable mosaics. A quieter corner.", tone: "neutral" },
};

function deriveThemes(): Theme[] {
  const byTheme = new Map<string, CatalogSet[]>();
  for (const s of CATALOG_SETS) {
    const arr = byTheme.get(s.themeSlug) ?? [];
    arr.push(s);
    byTheme.set(s.themeSlug, arr);
  }
  const out: Theme[] = [];
  for (const [slug, sets] of byTheme.entries()) {
    const name = sets[0].theme;
    const meta = THEME_META[slug] ?? { tagline: name, tone: "neutral" as const };
    const avg = sets.reduce((a, s) => a + s.appreciation, 0) / sets.length;
    const hero = [...sets].sort((a, b) => b.currentValue - a.currentValue)[0];
    out.push({
      slug,
      name,
      tagline: meta.tagline,
      tone: meta.tone,
      pinned: meta.pinned,
      setCount: sets.length,
      avgAppreciation: Number(avg.toFixed(1)),
      heroSetId: hero.id,
    });
  }
  return out.sort((a, b) => (Number(!!b.pinned) - Number(!!a.pinned)) || b.avgAppreciation - a.avgAppreciation);
}

export const CATALOG_THEMES: Theme[] = deriveThemes();

/* ── Stable per-set sparkline ─────────────────────────────────── */

const seriesCache = new Map<string, SeriesPoint[]>();

export function sparklineForSet(
  set: CatalogSet,
  points = 45,
): SeriesPoint[] {
  const key = `${set.id}:${points}`;
  const cached = seriesCache.get(key);
  if (cached) return cached;
  const seed = hashCode(set.id);
  const drift = set.pctChange30d / 100 / points; // end-of-window drift to match delta
  const vol = 0.02 + Math.abs(set.pctChange30d) / 400;
  const start = set.currentValue / (1 + set.pctChange30d / 100);
  const series = randomWalk({ points, start, vol, drift, seed });
  seriesCache.set(key, series);
  return series;
}

export function themeIndexSeries(theme: Theme): SeriesPoint[] {
  const key = `theme:${theme.slug}`;
  const cached = seriesCache.get(key);
  if (cached) return cached;
  const seed = hashCode(theme.slug);
  const drift = theme.avgAppreciation / 100 / 180;
  const vol = theme.tone === "warm" ? 0.014 : theme.tone === "cool" ? 0.008 : 0.011;
  const series = randomWalk({ points: 180, start: 100, vol, drift, seed });
  seriesCache.set(key, series);
  return series;
}

function hashCode(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* ── Filter / sort / derive ───────────────────────────────────── */

export const CATALOG_STATUSES: SetStatus[] = [
  "available",
  "retired",
  "retiring-soon",
  "exclusive",
  "unreleased",
];

export type CatalogSortKey =
  | "trending"
  | "price-desc"
  | "price-asc"
  | "appreciation-desc"
  | "appreciation-asc"
  | "year-desc"
  | "year-asc"
  | "name-asc";

export interface CatalogFilters {
  q?: string;
  statuses: SetStatus[];
  themes: string[]; // theme slugs
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  partsMin?: number;
  partsMax?: number;
  sort: CatalogSortKey;
}

export const YEAR_RANGE: [number, number] = (() => {
  const years = CATALOG_SETS.map((s) => s.year);
  return [Math.min(...years), Math.max(...years)];
})();

export const PRICE_RANGE: [number, number] = [0, 900];
export const PARTS_RANGE: [number, number] = [0, 12000];

export function applyCatalogFilters(
  sets: CatalogSet[],
  f: CatalogFilters,
): CatalogSet[] {
  const q = f.q?.trim().toLowerCase();
  return sets
    .filter((s) => {
      if (q) {
        const hay = `${s.name} ${s.id} ${s.theme}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (f.statuses.length && !f.statuses.includes(s.status)) return false;
      if (f.themes.length && !f.themes.includes(s.themeSlug)) return false;
      if (f.yearMin != null && s.year < f.yearMin) return false;
      if (f.yearMax != null && s.year > f.yearMax) return false;
      if (f.priceMin != null && s.currentValue < f.priceMin) return false;
      if (f.priceMax != null && s.currentValue > f.priceMax) return false;
      if (f.partsMin != null && s.parts < f.partsMin) return false;
      if (f.partsMax != null && s.parts > f.partsMax) return false;
      return true;
    })
    .sort((a, b) => {
      switch (f.sort) {
        case "trending":
          return b.pctChange30d - a.pctChange30d;
        case "price-desc":
          return b.currentValue - a.currentValue;
        case "price-asc":
          return a.currentValue - b.currentValue;
        case "appreciation-desc":
          return b.appreciation - a.appreciation;
        case "appreciation-asc":
          return a.appreciation - b.appreciation;
        case "year-desc":
          return b.year - a.year;
        case "year-asc":
          return a.year - b.year;
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
}

export function findTheme(slug: string): Theme | undefined {
  return CATALOG_THEMES.find((t) => t.slug === slug);
}

export function setsForTheme(slug: string): CatalogSet[] {
  return CATALOG_SETS.filter((s) => s.themeSlug === slug);
}
