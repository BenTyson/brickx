import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";

interface RefreshOptions {
  maxSets?: number;
  staleHours?: number;
}

async function selectStaleSets(
  supabase: ReturnType<typeof createAdminClient>,
  maxSets: number,
  staleHours: number,
): Promise<string[]> {
  const staleThreshold = new Date(
    Date.now() - staleHours * 60 * 60 * 1000,
  ).toISOString();

  const setIds: string[] = [];

  // Priority 1: Sets in user collections with stale or no prices
  const { data: collectionSets } = await supabase
    .from("collection_items")
    .select("set_id")
    .limit(Math.round(maxSets * 0.4));

  if (collectionSets) {
    const uniqueCollectionSetIds = [
      ...new Set(collectionSets.map((r) => r.set_id)),
    ];
    setIds.push(...uniqueCollectionSetIds);
  }

  const remaining = maxSets - setIds.length;
  if (remaining <= 0) return setIds.slice(0, maxSets);

  // Priority 2: Available sets with oldest fetch date
  const { data: staleSets } = await supabase
    .from("set_prices")
    .select("set_id")
    .lt("fetched_at", staleThreshold)
    .order("fetched_at", { ascending: true })
    .limit(Math.round(remaining * 0.5));

  if (staleSets) {
    const stalePriceSetIds = [...new Set(staleSets.map((r) => r.set_id))];
    for (const id of stalePriceSetIds) {
      if (!setIds.includes(id)) setIds.push(id);
    }
  }

  const remaining2 = maxSets - setIds.length;
  if (remaining2 <= 0) return setIds.slice(0, maxSets);

  // Priority 3: Available sets with no prices at all
  const { data: availableSets } = await supabase
    .from("sets")
    .select("id")
    .eq("status", "available")
    .order("num_parts", { ascending: false })
    .limit(remaining2 * 2); // Over-fetch then filter

  if (availableSets) {
    // Filter to those not already in set_prices
    for (const row of availableSets) {
      if (setIds.length >= maxSets) break;
      if (!setIds.includes(row.id)) {
        const { count } = await supabase
          .from("set_prices")
          .select("id", { count: "exact", head: true })
          .eq("set_id", row.id);
        if (count === 0) {
          setIds.push(row.id);
        }
      }
    }
  }

  return setIds.slice(0, maxSets);
}

export async function refreshPrices(
  options: RefreshOptions = {},
): Promise<void> {
  const maxSets = options.maxSets ?? 500;
  const staleHours = options.staleHours ?? 24;
  const supabase = createAdminClient();

  logger.info("Starting price refresh", { maxSets, staleHours });

  const setIds = await selectStaleSets(supabase, maxSets, staleHours);

  if (setIds.length === 0) {
    logger.info("No stale sets found — nothing to refresh");
    return;
  }

  logger.info(`Selected ${setIds.length} sets for refresh`);

  const { seedPrices } = await import("./seed-prices.js");
  await seedPrices({ setIds, limit: setIds.length });

  logger.info("Price refresh complete");
}

if (import.meta.filename === process.argv[1]) {
  const maxSetsArg = process.argv.indexOf("--max-sets");
  const maxSets =
    maxSetsArg !== -1 ? parseInt(process.argv[maxSetsArg + 1], 10) : undefined;

  const staleHoursArg = process.argv.indexOf("--stale-hours");
  const staleHours =
    staleHoursArg !== -1
      ? parseInt(process.argv[staleHoursArg + 1], 10)
      : undefined;

  refreshPrices({ maxSets, staleHours }).catch((err) => {
    console.error("Price refresh failed:", err);
    process.exit(1);
  });
}
