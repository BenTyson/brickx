/**
 * Deterministic mock series generators for demo/* routes.
 * Seeded PRNG keeps shapes stable across renders so charts don't flicker.
 */

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export type SeriesPoint = { t: number; v: number };

/**
 * Generate a random-walk series of `points` data points starting at `start`,
 * with daily volatility `vol` and drift `drift` (per step, as a fraction).
 */
export function randomWalk({
  points = 90,
  start = 100,
  vol = 0.02,
  drift = 0.0015,
  seed = 1,
}: {
  points?: number;
  start?: number;
  vol?: number;
  drift?: number;
  seed?: number;
} = {}): SeriesPoint[] {
  const rng = mulberry32(seed);
  const out: SeriesPoint[] = [];
  let v = start;
  for (let i = 0; i < points; i++) {
    // Box-Muller-ish gaussian via two uniforms
    const u1 = Math.max(rng(), 1e-9);
    const u2 = rng();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    v = Math.max(0.01, v * (1 + drift + vol * z));
    out.push({ t: i, v: Number(v.toFixed(2)) });
  }
  return out;
}

/** Extract the pct change between first and last points of a series. */
export function seriesDelta(points: SeriesPoint[]): number {
  if (points.length < 2) return 0;
  const first = points[0].v;
  const last = points[points.length - 1].v;
  if (first === 0) return 0;
  return ((last - first) / first) * 100;
}

/** Date-backed series for use in charts where the x axis is a real date. */
export type DatedPoint = { date: string; v: number };

export function datedRandomWalk(args: {
  days?: number;
  start?: number;
  vol?: number;
  drift?: number;
  seed?: number;
  endDate?: Date;
}): DatedPoint[] {
  const {
    days = 90,
    start = 100,
    vol = 0.02,
    drift = 0.0015,
    seed = 1,
    endDate = new Date(),
  } = args;
  const raw = randomWalk({ points: days, start, vol, drift, seed });
  const out: DatedPoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - (days - 1 - i));
    out.push({ date: d.toISOString().slice(0, 10), v: raw[i].v });
  }
  return out;
}

/** Generate two correlated series (new + used). */
export function correlatedPair({
  days = 180,
  newStart = 180,
  usedStart = 120,
  seed = 7,
}: {
  days?: number;
  newStart?: number;
  usedStart?: number;
  seed?: number;
} = {}): { new: DatedPoint[]; used: DatedPoint[] } {
  const a = datedRandomWalk({ days, start: newStart, vol: 0.02, seed });
  const b = datedRandomWalk({
    days,
    start: usedStart,
    vol: 0.024,
    seed: seed + 11,
  });
  // gently tie used to new so they move together
  for (let i = 0; i < days; i++) {
    b[i] = {
      date: a[i].date,
      v: Number(
        (b[i].v * 0.6 + (a[i].v * usedStart) / newStart * 0.4).toFixed(2),
      ),
    };
  }
  return { new: a, used: b };
}

export type PriceChartEvent = {
  date: string;
  label: string;
  kind?: "retirement" | "re-release" | "announcement";
};
