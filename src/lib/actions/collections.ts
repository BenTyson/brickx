"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ItemCondition } from "@/lib/types/database";

export async function createCollection(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("collections")
    .insert({ user_id: user.id, name: name.trim() })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/collections");
  return data;
}

export async function renameCollection(id: string, name: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("collections")
    .update({ name: name.trim() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/collections");
  revalidatePath(`/collections/${id}`);
}

export async function deleteCollection(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("collections").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/collections");
}

export async function addItemToCollection(data: {
  collectionId: string;
  setId: string;
  condition: ItemCondition;
  purchasePrice?: number | null;
  purchaseDate?: string | null;
  notes?: string | null;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("collection_items").insert({
    collection_id: data.collectionId,
    set_id: data.setId,
    condition: data.condition,
    purchase_price: data.purchasePrice ?? null,
    purchase_date: data.purchaseDate ?? null,
    notes: data.notes ?? null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/collections");
  revalidatePath(`/collections/${data.collectionId}`);
  revalidatePath("/portfolio");
}

export async function updateCollectionItem(
  id: string,
  data: {
    condition?: ItemCondition;
    purchasePrice?: number | null;
    purchaseDate?: string | null;
    notes?: string | null;
  },
) {
  const supabase = await createClient();

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (data.condition !== undefined) update.condition = data.condition;
  if (data.purchasePrice !== undefined)
    update.purchase_price = data.purchasePrice;
  if (data.purchaseDate !== undefined) update.purchase_date = data.purchaseDate;
  if (data.notes !== undefined) update.notes = data.notes;

  const { error } = await supabase
    .from("collection_items")
    .update(update)
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/collections");
  revalidatePath("/portfolio");
}

export async function removeCollectionItem(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("collection_items")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/collections");
  revalidatePath("/portfolio");
}
