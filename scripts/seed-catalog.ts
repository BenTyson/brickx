import { createReadStream } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

type PartsInsert = Database["public"]["Tables"]["parts"]["Insert"];
type MinifigsInsert = Database["public"]["Tables"]["minifigs"]["Insert"];
type SetsInsert = Database["public"]["Tables"]["sets"]["Insert"];

const DATA_DIR = join(import.meta.dirname, "..", "data");
const BATCH_SIZE = 500;

type AdminClient = SupabaseClient<Database>;

function csvPath(name: string): string {
  return join(DATA_DIR, `${name}.csv`);
}

function nullOrInt(val: string | undefined): number | null {
  if (!val || val === "") return null;
  const n = parseInt(val, 10);
  return isNaN(n) ? null : n;
}

function statusHeuristic(year: number): "available" | "retired" | "unreleased" {
  const currentYear = new Date().getFullYear();
  if (year > currentYear) return "unreleased";
  if (year < currentYear - 2) return "retired";
  return "available";
}

async function readCsv(filePath: string): Promise<Record<string, string>[]> {
  const rows: Record<string, string>[] = [];
  const parser = createReadStream(filePath).pipe(
    parse({ columns: true, skip_empty_lines: true, trim: true }),
  );
  for await (const row of parser) {
    rows.push(row as Record<string, string>);
  }
  return rows;
}

async function streamCsvBatches(
  filePath: string,
  batchSize: number,
  onBatch: (batch: Record<string, string>[]) => Promise<void>,
): Promise<number> {
  const parser = createReadStream(filePath).pipe(
    parse({ columns: true, skip_empty_lines: true, trim: true }),
  );

  let buffer: Record<string, string>[] = [];
  let total = 0;

  for await (const row of parser) {
    buffer.push(row as Record<string, string>);
    if (buffer.length >= batchSize) {
      await onBatch(buffer);
      total += buffer.length;
      buffer = [];
    }
  }

  if (buffer.length > 0) {
    await onBatch(buffer);
    total += buffer.length;
  }

  return total;
}

async function batchUpsert<T extends Record<string, unknown>>(
  supabase: AdminClient,
  table: string,
  rows: T[],
  onConflict: string,
): Promise<void> {
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from(table)
      .upsert(batch as never[], { onConflict });
    if (error) {
      throw new Error(`Upsert to ${table} failed: ${error.message}`);
    }
  }
}

async function seedThemes(supabase: AdminClient): Promise<number> {
  console.log("Seeding themes...");
  const rows = await readCsv(csvPath("themes"));

  // First pass: insert all themes with parent_id = null
  const themes = rows.map((row) => ({
    id: parseInt(row.id, 10),
    name: row.name,
    parent_id: null as number | null,
  }));

  await batchUpsert(supabase, "themes", themes, "id");

  // Second pass: update parent_id values
  const withParent = rows
    .filter((row) => row.parent_id && row.parent_id !== "")
    .map((row) => ({
      id: parseInt(row.id, 10),
      name: row.name,
      parent_id: parseInt(row.parent_id, 10),
    }));

  if (withParent.length > 0) {
    await batchUpsert(supabase, "themes", withParent, "id");
  }

  console.log(
    `  Seeded ${themes.length} themes (${withParent.length} with parent)`,
  );
  return themes.length;
}

async function seedColors(supabase: AdminClient): Promise<number> {
  console.log("Seeding colors...");
  const rows = await readCsv(csvPath("colors"));

  const colors = rows.map((row) => ({
    id: parseInt(row.id, 10),
    name: row.name,
    rgb: row.rgb || null,
    is_trans: row.is_trans === "t",
  }));

  await batchUpsert(supabase, "colors", colors, "id");
  console.log(`  Seeded ${colors.length} colors`);
  return colors.length;
}

async function seedParts(supabase: AdminClient): Promise<number> {
  console.log("Seeding parts (streaming)...");

  const total = await streamCsvBatches(
    csvPath("parts"),
    BATCH_SIZE,
    async (batch) => {
      const mapped: PartsInsert[] = batch.map((row) => ({
        part_num: row.part_num,
        name: row.name,
        category_id: nullOrInt(row.part_cat_id),
        img_url: row.part_img_url || null,
      }));
      const { error } = await supabase
        .from("parts")
        .upsert(mapped, { onConflict: "part_num" });
      if (error) {
        throw new Error(`Upsert to parts failed: ${error.message}`);
      }
    },
  );

  console.log(`  Seeded ${total} parts`);
  return total;
}

async function seedMinifigs(supabase: AdminClient): Promise<number> {
  console.log("Seeding minifigs (streaming)...");

  const total = await streamCsvBatches(
    csvPath("minifigs"),
    BATCH_SIZE,
    async (batch) => {
      const mapped: MinifigsInsert[] = batch.map((row) => ({
        fig_num: row.fig_num,
        name: row.name,
        num_parts: nullOrInt(row.num_parts),
        img_url: row.img_url || null,
      }));
      const { error } = await supabase
        .from("minifigs")
        .upsert(mapped, { onConflict: "fig_num" });
      if (error) {
        throw new Error(`Upsert to minifigs failed: ${error.message}`);
      }
    },
  );

  console.log(`  Seeded ${total} minifigs`);
  return total;
}

async function seedSets(supabase: AdminClient): Promise<number> {
  console.log("Seeding sets (streaming)...");

  const total = await streamCsvBatches(
    csvPath("sets"),
    BATCH_SIZE,
    async (batch) => {
      const mapped: SetsInsert[] = batch.map((row) => {
        const year = parseInt(row.year, 10);
        return {
          id: row.set_num,
          name: row.name,
          year,
          theme_id: nullOrInt(row.theme_id),
          num_parts: nullOrInt(row.num_parts),
          img_url: row.img_url || null,
          set_url: `https://rebrickable.com/sets/${row.set_num}/`,
          status: statusHeuristic(year),
        };
      });
      const { error } = await supabase
        .from("sets")
        .upsert(mapped, { onConflict: "id" });
      if (error) {
        throw new Error(`Upsert to sets failed: ${error.message}`);
      }
    },
  );

  console.log(`  Seeded ${total} sets`);
  return total;
}

export async function seedCatalog(): Promise<void> {
  const supabase = createAdminClient();

  const counts: Record<string, number> = {};

  // Insertion order respects FK constraints
  counts.themes = await seedThemes(supabase);
  counts.colors = await seedColors(supabase);
  counts.parts = await seedParts(supabase);
  counts.minifigs = await seedMinifigs(supabase);
  counts.sets = await seedSets(supabase);

  console.log("\nCatalog seeding complete:", counts);
}

if (import.meta.filename === process.argv[1]) {
  seedCatalog().catch((err) => {
    console.error("Catalog seeding failed:", err);
    process.exit(1);
  });
}
