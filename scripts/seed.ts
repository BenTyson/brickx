async function run() {
  console.log("=== BrickX Full Seed Pipeline ===\n");

  // Step 1: Download CSVs
  console.log("[1/3] Downloading Rebrickable CSVs...");
  const startDownload = Date.now();
  const { downloadAll } = await import("./download-csvs.js");
  await downloadAll();
  console.log(
    `  Done in ${((Date.now() - startDownload) / 1000).toFixed(1)}s\n`,
  );

  // Step 2: Seed catalog
  console.log("[2/3] Seeding catalog data...");
  const startCatalog = Date.now();
  const { seedCatalog } = await import("./seed-catalog.js");
  await seedCatalog();
  console.log(
    `  Done in ${((Date.now() - startCatalog) / 1000).toFixed(1)}s\n`,
  );

  // Step 3: Seed prices (optional)
  const hasAnyApiKey =
    !!process.env.BRICKLINK_CONSUMER_KEY ||
    !!process.env.BRICKECONOMY_API_KEY ||
    !!process.env.BRICKOWL_API_KEY;

  if (hasAnyApiKey) {
    console.log("[3/3] Seeding price data...");
    const startPrices = Date.now();
    const { seedPrices } = await import("./seed-prices.js");
    await seedPrices({ limit: 2500 });
    console.log(
      `  Done in ${((Date.now() - startPrices) / 1000).toFixed(1)}s\n`,
    );
  } else {
    console.log("[3/3] Skipping price seeding (no API keys configured)\n");
  }

  console.log("=== Seed pipeline complete ===");
}

run().catch((err) => {
  console.error("Seed pipeline failed:", err);
  process.exit(1);
});
