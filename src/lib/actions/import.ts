"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseImportFile, type ImportFormat } from "@/lib/utils/csv-parser";

export interface PreviewRow {
  set_num: string;
  set_name: string | null;
  condition: "new" | "used";
  purchase_price: number | null;
  purchase_date: string | null;
  notes: string | null;
  matched: boolean;
  error: string | null;
}

export interface ImportPreview {
  format: ImportFormat;
  rows: PreviewRow[];
  parseErrors: string[];
  matchedCount: number;
  unmatchedCount: number;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

export async function previewImport(fileText: string): Promise<ImportPreview> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const parsed = parseImportFile(fileText);

  if (parsed.rows.length === 0) {
    return {
      format: parsed.format,
      rows: [],
      parseErrors: parsed.parseErrors,
      matchedCount: 0,
      unmatchedCount: 0,
    };
  }

  // Batch-lookup all set IDs
  const setNums = [...new Set(parsed.rows.map((r) => r.set_num))];
  const { data: sets } = await supabase
    .from("sets")
    .select("id, name")
    .in("id", setNums);

  const setMap = new Map<string, string>((sets ?? []).map((s) => [s.id, s.name]));

  const rows: PreviewRow[] = parsed.rows.map((row) => {
    const setName = setMap.get(row.set_num) ?? null;
    return {
      set_num: row.set_num,
      set_name: setName,
      condition: row.condition,
      purchase_price: row.purchase_price,
      purchase_date: row.purchase_date,
      notes: row.notes,
      matched: setName !== null,
      error: setName === null ? `Set "${row.set_num}" not found in BrickX catalog` : null,
    };
  });

  const matchedCount = rows.filter((r) => r.matched).length;

  return {
    format: parsed.format,
    rows,
    parseErrors: parsed.parseErrors,
    matchedCount,
    unmatchedCount: rows.length - matchedCount,
  };
}

export async function commitImport(
  preview: ImportPreview,
  collectionId: string,
  filename: string | null,
): Promise<ImportResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Verify the collection belongs to this user
  const { data: collection } = await supabase
    .from("collections")
    .select("id")
    .eq("id", collectionId)
    .eq("user_id", user.id)
    .single();
  if (!collection) throw new Error("Collection not found");

  const matchedRows = preview.rows.filter((r) => r.matched);
  const skipped = preview.rows.length - matchedRows.length;
  const errors: string[] = [];
  let imported = 0;

  if (matchedRows.length > 0) {
    const insertData = matchedRows.map((row) => ({
      collection_id: collectionId,
      set_id: row.set_num,
      condition: row.condition,
      purchase_price: row.purchase_price,
      purchase_date: row.purchase_date,
      notes: row.notes,
    }));

    const { error } = await supabase.from("collection_items").insert(insertData);
    if (error) {
      errors.push(`Database insert failed: ${error.message}`);
    } else {
      imported = matchedRows.length;
    }
  }

  // Log to import_history
  await supabase.from("import_history").insert({
    user_id: user.id,
    format: preview.format,
    filename,
    collection_id: collectionId,
    rows_total: preview.rows.length,
    rows_imported: imported,
    rows_skipped: skipped,
    rows_error: errors.length,
    error_details: errors.length > 0 ? { errors } : null,
  });

  revalidatePath(`/collections/${collectionId}`);
  revalidatePath("/collections");
  revalidatePath("/portfolio");

  return { imported, skipped, errors };
}

export async function markOnboarded(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase
    .from("users")
    .update({ onboarded_at: new Date().toISOString() })
    .eq("id", user.id);
}

export async function fetchImportHistory() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("import_history")
    .select("id, format, filename, collection_id, rows_total, rows_imported, rows_skipped, rows_error, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!data || data.length === 0) return [];

  // Batch-fetch collection names
  const collectionIds = [...new Set(data.map((r) => r.collection_id).filter(Boolean))] as string[];
  const { data: collections } = collectionIds.length > 0
    ? await supabase.from("collections").select("id, name").in("id", collectionIds)
    : { data: [] };
  const collectionMap = new Map<string, string>((collections ?? []).map((c) => [c.id, c.name]));

  return data.map((row) => ({
    id: row.id,
    format: row.format,
    filename: row.filename,
    collection_id: row.collection_id,
    collection_name: row.collection_id ? (collectionMap.get(row.collection_id) ?? null) : null,
    rows_total: row.rows_total,
    rows_imported: row.rows_imported,
    rows_skipped: row.rows_skipped,
    rows_error: row.rows_error,
    created_at: row.created_at,
  }));
}
