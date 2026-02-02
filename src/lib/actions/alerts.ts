"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AlertType } from "@/lib/types/database";

export async function createPriceAlert(data: {
  setId: string;
  alertType: AlertType;
  targetPrice?: number | null;
  thresholdPct?: number | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("price_alerts").insert({
    user_id: user.id,
    set_id: data.setId,
    alert_type: data.alertType,
    target_price: data.targetPrice ?? null,
    threshold_pct: data.thresholdPct ?? null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/alerts");
  revalidatePath(`/sets/${data.setId}`);
}

export async function dismissAlert(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("price_alerts")
    .update({ status: "dismissed", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/alerts");
}

export async function markAlertRead(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("price_alerts")
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/alerts");
}

export async function markAllAlertsRead() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("price_alerts")
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) throw new Error(error.message);

  revalidatePath("/alerts");
}

export async function deleteAlert(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("price_alerts").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/alerts");
}

export async function updateNotificationPreferences(data: {
  emailAlerts: boolean;
  priceDropAlerts: boolean;
  valueExceededAlerts: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("notification_preferences").upsert(
    {
      user_id: user.id,
      email_alerts: data.emailAlerts,
      price_drop_alerts: data.priceDropAlerts,
      value_exceeded_alerts: data.valueExceededAlerts,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) throw new Error(error.message);

  revalidatePath("/alerts/preferences");
}
