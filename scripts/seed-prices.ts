import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";
import { aggregatePrices } from "@/lib/services/price-aggregator";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

type AdminClient = SupabaseClient<Database>;
type SetPriceInsert = Database["public"]["Tables"]["set_prices"]["Insert"];

interface SeedPricesOptions {
  limit?: number;
  setIds?: string[];
}

function hasEnv(key: string): boolean {
  return !!process.env[key];
}

interface EnabledSources {
  bricklink: boolean;
  brickeconomy: boolean;
  brickowl: boolean;
}

function detectSources(): EnabledSources {
  const sources: EnabledSources = {
    bricklink: hasEnv("BRICKLINK_CONSUMER_KEY") && hasEnv("BRICKLINK_TOKEN"),
    brickeconomy: hasEnv("BRICKECONOMY_API_KEY"),
    brickowl: hasEnv("BRICKOWL_API_KEY"),
  };
  logger.info(
    "Enabled price sources",
    sources as unknown as Record<string, unknown>,
  );
  return sources;
}

async function selectSets(
  supabase: AdminClient,
  limit: number,
): Promise<string[]> {
  const tier1Count = Math.round(limit * 0.6);
  const tier2Count = Math.round(limit * 0.2);
  const tier3Count = limit - tier1Count - tier2Count;
  const currentYear = new Date().getFullYear();

  const ids: string[] = [];

  // Tier 1: available sets by num_parts DESC
  const { data: tier1 } = await supabase
    .from("sets")
    .select("id")
    .eq("status", "available")
    .order("num_parts", { ascending: false })
    .limit(tier1Count);
  if (tier1) ids.push(...tier1.map((r) => r.id));

  // Tier 2: recently retired (last 5 years) by num_parts DESC
  const { data: tier2 } = await supabase
    .from("sets")
    .select("id")
    .eq("status", "retired")
    .gte("year", currentYear - 5)
    .order("num_parts", { ascending: false })
    .limit(tier2Count);
  if (tier2) ids.push(...tier2.map((r) => r.id));

  // Tier 3: classic retired (year >= 2000, parts >= 500) by year DESC
  const { data: tier3 } = await supabase
    .from("sets")
    .select("id")
    .eq("status", "retired")
    .gte("year", 2000)
    .lt("year", currentYear - 5)
    .gte("num_parts", 500)
    .order("year", { ascending: false })
    .limit(tier3Count);
  if (tier3) ids.push(...tier3.map((r) => r.id));

  // Deduplicate
  return [...new Set(ids)];
}

async function fetchBrickLinkPrices(
  setId: string,
): Promise<SetPriceInsert | null> {
  const { getPriceGuide } = await import("@/lib/services/bricklink");
  try {
    const [newGuide, usedGuide] = await Promise.all([
      getPriceGuide(setId, "N"),
      getPriceGuide(setId, "U"),
    ]);
    return {
      set_id: setId,
      source: "bricklink",
      new_avg: parseFloat(newGuide.avg_price) || null,
      new_min: parseFloat(newGuide.min_price) || null,
      new_max: parseFloat(newGuide.max_price) || null,
      new_qty_sold: newGuide.total_quantity || null,
      used_avg: parseFloat(usedGuide.avg_price) || null,
      used_min: parseFloat(usedGuide.min_price) || null,
      used_max: parseFloat(usedGuide.max_price) || null,
      used_qty_sold: usedGuide.total_quantity || null,
    };
  } catch (err) {
    logger.warn(`BrickLink fetch failed for ${setId}`, {
      error: (err as Error).message,
    });
    return null;
  }
}

async function fetchBrickEconomyPrices(
  setId: string,
): Promise<SetPriceInsert | null> {
  const { getSetValuation } = await import("@/lib/services/brickeconomy");
  try {
    const val = await getSetValuation(setId);
    return {
      set_id: setId,
      source: "brickeconomy",
      new_avg: val.current_new_value,
      used_avg: val.current_used_value,
    };
  } catch (err) {
    logger.warn(`BrickEconomy fetch failed for ${setId}`, {
      error: (err as Error).message,
    });
    return null;
  }
}

async function fetchBrickOwlPrices(
  setId: string,
): Promise<SetPriceInsert | null> {
  const { lookupId, getPricing } = await import("@/lib/services/brickowl");
  try {
    const lookup = await lookupId(setId);
    if (!lookup.boids || lookup.boids.length === 0) {
      logger.warn(`BrickOwl: no BOID found for ${setId}`);
      return null;
    }
    const pricing = await getPricing(lookup.boids[0]);
    return {
      set_id: setId,
      source: "brickowl",
      new_avg: pricing.new_avg ? parseFloat(pricing.new_avg) : null,
      new_min: pricing.new_min ? parseFloat(pricing.new_min) : null,
      new_max: pricing.new_max ? parseFloat(pricing.new_max) : null,
      new_qty_sold: pricing.new_qty || null,
      used_avg: pricing.used_avg ? parseFloat(pricing.used_avg) : null,
      used_min: pricing.used_min ? parseFloat(pricing.used_min) : null,
      used_max: pricing.used_max ? parseFloat(pricing.used_max) : null,
      used_qty_sold: pricing.used_qty || null,
    };
  } catch (err) {
    logger.warn(`BrickOwl fetch failed for ${setId}`, {
      error: (err as Error).message,
    });
    return null;
  }
}

export async function seedPrices(
  options: SeedPricesOptions = {},
): Promise<void> {
  const supabase = createAdminClient();
  const limit = options.limit ?? 2500;
  const sources = detectSources();

  const enabledCount = Object.values(sources).filter(Boolean).length;
  if (enabledCount === 0) {
    logger.warn("No price sources configured — skipping price seeding");
    return;
  }

  // Select sets to process
  const setIds =
    options.setIds && options.setIds.length > 0
      ? options.setIds
      : await selectSets(supabase, limit);

  logger.info("Starting price seeding", {
    setCount: setIds.length,
    sources: sources as unknown as Record<string, unknown>,
  });

  let inserted = 0;
  const processedSetIds: string[] = [];

  for (let i = 0; i < setIds.length; i++) {
    const setId = setIds[i];

    const fetchers: Promise<SetPriceInsert | null>[] = [];
    if (sources.bricklink) fetchers.push(fetchBrickLinkPrices(setId));
    if (sources.brickeconomy) fetchers.push(fetchBrickEconomyPrices(setId));
    if (sources.brickowl) fetchers.push(fetchBrickOwlPrices(setId));

    const results = await Promise.allSettled(fetchers);
    const prices = results
      .filter(
        (r): r is PromiseFulfilledResult<SetPriceInsert | null> =>
          r.status === "fulfilled",
      )
      .map((r) => r.value)
      .filter((p): p is SetPriceInsert => p !== null);

    if (prices.length > 0) {
      const { error } = await supabase.from("set_prices").insert(prices);
      if (error) {
        logger.warn(`Failed to insert prices for ${setId}`, {
          error: error.message,
        });
      } else {
        inserted += prices.length;
        processedSetIds.push(setId);
      }
    }

    if ((i + 1) % 100 === 0) {
      logger.info(`Progress: ${i + 1}/${setIds.length} sets processed`);
    }
  }

  logger.info("Price fetching complete", {
    setsProcessed: setIds.length,
    pricesInserted: inserted,
  });

  // Aggregate prices for processed sets
  if (processedSetIds.length > 0) {
    logger.info("Running price aggregation...");
    const aggregated = await aggregatePrices(supabase, processedSetIds);
    logger.info("Aggregation complete", { valuesWritten: aggregated });
  }
}

if (import.meta.filename === process.argv[1]) {
  const limitArg = process.argv.indexOf("--limit");
  const limit =
    limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : undefined;

  seedPrices({ limit }).catch((err) => {
    console.error("Price seeding failed:", err);
    process.exit(1);
  });
}
