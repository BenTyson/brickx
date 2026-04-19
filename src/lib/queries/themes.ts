import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";
import { type SetRow, flattenSetRow } from "./helpers";
import type { CatalogSet } from "@/lib/types/catalog";

export interface ThemeSummary {
  id: number;
  slug: string;
  name: string;
  setCount: number;
  avgAppreciation: number | null;
  heroSet: CatalogSet | null;
}

export interface ThemeDetail extends ThemeSummary {
  sets: CatalogSet[];
  retiredCount: number;
  topReturn: number | null;
  avgValue: number | null;
}

interface ThemeRow {
  id: number;
  name: string;
}

/**
 * Fetch all themes with aggregated counts + appreciation.
 * Used by /themes hub and for theme-link resolution.
 */
export async function fetchThemes(): Promise<ThemeSummary[]> {
  const supabase = await createClient();

  const [themesRes, setsRes] = await Promise.all([
    supabase.from("themes").select("id, name"),
    supabase
      .from("sets")
      .select("*, themes(name), set_market_values(*)")
      .not("theme_id", "is", null),
  ]);

  if (themesRes.error || !themesRes.data) return [];
  if (setsRes.error || !setsRes.data) return [];

  const sets = (setsRes.data as unknown as SetRow[]).map(flattenSetRow);
  const themesById = new Map<number, ThemeRow>();
  for (const t of themesRes.data) themesById.set(t.id, t);

  const grouped = new Map<number, CatalogSet[]>();
  for (const s of sets) {
    if (s.theme_id == null) continue;
    const arr = grouped.get(s.theme_id) ?? [];
    arr.push(s);
    grouped.set(s.theme_id, arr);
  }

  const out: ThemeSummary[] = [];
  for (const [themeId, themeSets] of grouped.entries()) {
    const theme = themesById.get(themeId);
    if (!theme) continue;

    const growthValues = themeSets
      .map((s) => s.growth_annual_pct)
      .filter((v): v is number => v != null);
    const avgAppreciation =
      growthValues.length > 0
        ? growthValues.reduce((a, b) => a + b, 0) / growthValues.length
        : null;

    const hero =
      [...themeSets]
        .filter((s) => s.market_value_new != null)
        .sort(
          (a, b) => (b.market_value_new ?? 0) - (a.market_value_new ?? 0),
        )[0] ?? themeSets[0] ?? null;

    out.push({
      id: themeId,
      slug: slugify(theme.name),
      name: theme.name,
      setCount: themeSets.length,
      avgAppreciation,
      heroSet: hero,
    });
  }

  return out.sort((a, b) => b.setCount - a.setCount);
}

/**
 * Fetch a single theme by slug with its constituents.
 * Slug resolution is best-effort: slugify(name) must match.
 */
export async function fetchThemeDetail(
  slug: string,
): Promise<ThemeDetail | null> {
  const supabase = await createClient();

  const { data: themesData, error: themesErr } = await supabase
    .from("themes")
    .select("id, name");
  if (themesErr || !themesData) return null;

  const theme = themesData.find((t) => slugify(t.name) === slug);
  if (!theme) return null;

  const { data: setsData, error: setsErr } = await supabase
    .from("sets")
    .select("*, themes(name), set_market_values(*)")
    .eq("theme_id", theme.id);
  if (setsErr || !setsData) return null;

  const sets = (setsData as unknown as SetRow[]).map(flattenSetRow);

  const growthValues = sets
    .map((s) => s.growth_annual_pct)
    .filter((v): v is number => v != null);
  const avgAppreciation =
    growthValues.length > 0
      ? growthValues.reduce((a, b) => a + b, 0) / growthValues.length
      : null;

  const values = sets
    .map((s) => s.market_value_new)
    .filter((v): v is number => v != null);
  const avgValue =
    values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : null;

  const topReturn =
    growthValues.length > 0 ? Math.max(...growthValues) : null;

  const retiredCount = sets.filter((s) => s.status === "retired").length;

  const hero =
    [...sets]
      .filter((s) => s.market_value_new != null)
      .sort(
        (a, b) => (b.market_value_new ?? 0) - (a.market_value_new ?? 0),
      )[0] ?? sets[0] ?? null;

  return {
    id: theme.id,
    slug: slugify(theme.name),
    name: theme.name,
    setCount: sets.length,
    avgAppreciation,
    heroSet: hero,
    sets,
    retiredCount,
    topReturn,
    avgValue,
  };
}
