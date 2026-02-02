import { createClient } from "@/lib/supabase/server";
import type { NotificationPreferences, PriceAlert } from "@/lib/types/alerts";
import type { AlertStatus } from "@/lib/types/database";
import type { Database } from "@/lib/types/database";

type PriceAlertRow = Database["public"]["Tables"]["price_alerts"]["Row"];
type NotificationPreferencesRow =
  Database["public"]["Tables"]["notification_preferences"]["Row"];

interface AlertWithSet extends PriceAlertRow {
  sets: { name: string; img_url: string | null } | null;
}

/** Fetch all alerts for the authenticated user, with optional status filter */
export async function fetchUserAlerts(
  statusFilter?: AlertStatus | "all",
): Promise<PriceAlert[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("price_alerts")
    .select("*, sets(name, img_url)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;

  if (error || !data) return [];

  return (data as unknown as AlertWithSet[]).map((row) => ({
    id: row.id,
    user_id: row.user_id,
    set_id: row.set_id,
    alert_type: row.alert_type,
    target_price: row.target_price,
    threshold_pct: row.threshold_pct,
    is_read: row.is_read,
    status: row.status,
    triggered_at: row.triggered_at,
    triggered_value: row.triggered_value,
    created_at: row.created_at,
    updated_at: row.updated_at,
    set_name: row.sets?.name,
    set_img_url: row.sets?.img_url,
  }));
}

/** Fetch the count of unread triggered alerts for the authenticated user */
export async function fetchUnreadAlertCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("price_alerts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false)
    .eq("status", "triggered");

  if (error) return 0;
  return count ?? 0;
}

/** Fetch notification preferences for the authenticated user */
export async function fetchNotificationPreferences(): Promise<NotificationPreferences | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;

  const row = data as unknown as NotificationPreferencesRow;
  return {
    user_id: row.user_id,
    email_alerts: row.email_alerts,
    price_drop_alerts: row.price_drop_alerts,
    value_exceeded_alerts: row.value_exceeded_alerts,
  };
}
