import type { CatalogSet as DbCatalogSet } from "@/lib/types/catalog";
import type { CatalogSet as MockCatalogSet } from "@/lib/mock/catalog";
import type {
  TrendRow,
  TrendPeriod,
  RetiringSoonEntry,
  NewReleaseEntry,
} from "@/lib/mock/indices";
import { randomWalk } from "@/lib/mock/series";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapStatus(db: string | null | undefined): MockCatalogSet["status"] {
  if (db === "retired") return "retired";
  if (db === "unreleased") return "unreleased";
  return "available";
}

function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Convert a DB-backed CatalogSet into the v2 mock-shape CatalogSet used by
 * market-v2 / portfolio-v2 components. */
export function toMockSet(dbSet: DbCatalogSet): MockCatalogSet {
  const current =
    dbSet.market_value_new ?? dbSet.market_value_used ?? dbSet.msrp_usd ?? 0;
  const theme = dbSet.theme_name ?? "Other";
  return {
    id: dbSet.id,
    name: dbSet.name,
    theme,
    themeSlug: slugify(theme),
    year: dbSet.year,
    status: mapStatus(dbSet.status),
    imgUrl: dbSet.img_url,
    msrp: dbSet.msrp_usd ?? 0,
    currentValue: Number(current) || 0,
    pctChange30d: Number(dbSet.pct_change_30d ?? 0),
    parts: dbSet.num_parts ?? 0,
    minifigs: dbSet.num_minifigs ?? 0,
    appreciation: Number(dbSet.growth_annual_pct ?? 0),
  };
}

/* ── Trending adapter ──────────────────────────────────────────────── */

export function buildTrendRows(
  sets: DbCatalogSet[],
  period: TrendPeriod,
): { gainers: TrendRow[]; losers: TrendRow[] } {
  const pts = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const deltaKey =
    period === "7d"
      ? "pct_change_7d"
      : period === "30d"
        ? "pct_change_30d"
        : "pct_change_90d";
  const rows: TrendRow[] = sets.map((dbSet) => {
    const set = toMockSet(dbSet);
    const delta = Number((dbSet[deltaKey] ?? dbSet.pct_change_30d ?? 0) || 0);
    const seed = hashId(dbSet.id);
    return {
      rank: 0,
      set,
      delta: Number(delta.toFixed(2)),
      deltaAbs: Number(((set.currentValue * delta) / 100).toFixed(0)),
      volume: 20 + (seed % 300),
      sparkline: randomWalk({
        points: pts,
        start: set.currentValue * (delta >= 0 ? 0.9 : 1.05),
        vol: 0.022,
        drift: delta >= 0 ? 0.002 : -0.002,
        seed,
      }),
    };
  });
  const gainers = rows
    .filter((r) => r.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .map((r, i) => ({ ...r, rank: i + 1 }));
  const losers = rows
    .filter((r) => r.delta < 0)
    .sort((a, b) => a.delta - b.delta)
    .map((r, i) => ({ ...r, rank: i + 1 }));
  return { gainers, losers };
}

/* ── Retiring adapter ──────────────────────────────────────────────── */

export function buildRetiringEntries(
  sets: DbCatalogSet[],
): RetiringSoonEntry[] {
  return sets.map((dbSet) => {
    const set = toMockSet(dbSet);
    const seed = hashId(dbSet.id);
    const appreciation = set.appreciation;
    return {
      set,
      monthsLeft: 3 + (seed % 15),
      retirementAppreciation: Number(
        Math.max(appreciation, 30 + (seed % 50)).toFixed(0),
      ),
      riskScore: 20 + (seed % 60),
      sparkline: randomWalk({
        points: 60,
        start: Math.max(set.msrp, 1),
        vol: 0.015,
        drift: 0.001,
        seed,
      }),
    };
  });
}

/* ── New releases adapter ──────────────────────────────────────────── */

export function buildNewReleaseEntries(
  sets: DbCatalogSet[],
): NewReleaseEntry[] {
  return sets.map((dbSet) => {
    const set = toMockSet(dbSet);
    const seed = hashId(dbSet.id);
    const daysOnMarket = 15 + (seed % 60);
    const pts = randomWalk({
      points: Math.min(daysOnMarket, 30),
      start: Math.max(set.msrp, 1),
      vol: 0.018,
      drift: 0.0005,
      seed,
    });
    const priceVsMsrp =
      set.msrp > 0
        ? Number((((set.currentValue - set.msrp) / set.msrp) * 100).toFixed(1))
        : 0;
    return {
      set,
      daysOnMarket,
      priceVsMsrp,
      first30d: pts,
    };
  });
}
