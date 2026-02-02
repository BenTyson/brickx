import type { AlertStatus, AlertType } from "./database";

export type { AlertType, AlertStatus };

export interface PriceAlert {
  id: string;
  user_id: string;
  set_id: string;
  alert_type: AlertType;
  target_price: number | null;
  threshold_pct: number | null;
  is_read: boolean;
  status: AlertStatus;
  triggered_at: string | null;
  triggered_value: number | null;
  created_at: string;
  updated_at: string;
  set_name?: string;
  set_img_url?: string | null;
}

export interface NotificationPreferences {
  user_id: string;
  email_alerts: boolean;
  price_drop_alerts: boolean;
  value_exceeded_alerts: boolean;
}
