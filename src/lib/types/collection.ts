import type { ItemCondition } from "./database";

export interface CollectionSummary {
  id: string;
  name: string;
  created_at: string;
  item_count: number;
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  set_id: string;
  condition: ItemCondition;
  purchase_price: number | null;
  purchase_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined set data
  set_name: string;
  set_img_url: string | null;
  theme_name: string | null;
  year: number;
  // Joined market data
  market_value_new: number | null;
  market_value_used: number | null;
}

export interface CollectionWithItems {
  id: string;
  name: string;
  created_at: string;
  items: CollectionItem[];
}

export type PortfolioHistoryRange = "1W" | "1M" | "3M" | "1Y" | "ALL";

export interface PortfolioHistoryPoint {
  date: string;
  total_value: number;
  cost_basis: number;
  item_count: number;
}

export interface PortfolioHistory {
  range: PortfolioHistoryRange;
  points: PortfolioHistoryPoint[];
}

export interface ThemeAttribution {
  theme: string;
  start_value: number;
  end_value: number;
  gain: number;
}

export interface CollectionMover {
  set_id: string;
  set_name: string;
  set_img_url: string | null;
  theme_name: string | null;
  market_value: number;
  pct_change_30d: number | null;
}

export interface PortfolioSummary {
  total_value: number;
  total_cost: number;
  gain_loss: number;
  gain_loss_pct: number;
  total_sets: number;
  collections: {
    id: string;
    name: string;
    item_count: number;
    total_value: number;
    total_cost: number;
    gain_loss_pct: number;
  }[];
}
