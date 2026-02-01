export type SetStatus = "available" | "retired" | "unreleased";
export type ItemCondition = "new" | "used";

export interface Database {
  public: {
    Tables: {
      themes: {
        Row: {
          id: number;
          name: string;
          parent_id: number | null;
          created_at: string;
        };
        Insert: {
          id: number;
          name: string;
          parent_id?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          parent_id?: number | null;
          created_at?: string;
        };
      };
      sets: {
        Row: {
          id: string;
          name: string;
          year: number;
          theme_id: number | null;
          num_parts: number | null;
          num_minifigs: number | null;
          img_url: string | null;
          set_url: string | null;
          msrp_usd: number | null;
          status: SetStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          year: number;
          theme_id?: number | null;
          num_parts?: number | null;
          num_minifigs?: number | null;
          img_url?: string | null;
          set_url?: string | null;
          msrp_usd?: number | null;
          status?: SetStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          year?: number;
          theme_id?: number | null;
          num_parts?: number | null;
          num_minifigs?: number | null;
          img_url?: string | null;
          set_url?: string | null;
          msrp_usd?: number | null;
          status?: SetStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      set_prices: {
        Row: {
          id: string;
          set_id: string;
          source: string;
          new_avg: number | null;
          new_min: number | null;
          new_max: number | null;
          new_qty_sold: number | null;
          used_avg: number | null;
          used_min: number | null;
          used_max: number | null;
          used_qty_sold: number | null;
          fetched_at: string;
        };
        Insert: {
          id?: string;
          set_id: string;
          source: string;
          new_avg?: number | null;
          new_min?: number | null;
          new_max?: number | null;
          new_qty_sold?: number | null;
          used_avg?: number | null;
          used_min?: number | null;
          used_max?: number | null;
          used_qty_sold?: number | null;
          fetched_at?: string;
        };
        Update: {
          id?: string;
          set_id?: string;
          source?: string;
          new_avg?: number | null;
          new_min?: number | null;
          new_max?: number | null;
          new_qty_sold?: number | null;
          used_avg?: number | null;
          used_min?: number | null;
          used_max?: number | null;
          used_qty_sold?: number | null;
          fetched_at?: string;
        };
      };
      set_market_values: {
        Row: {
          set_id: string;
          market_value_new: number | null;
          market_value_used: number | null;
          pct_change_7d: number | null;
          pct_change_30d: number | null;
          pct_change_90d: number | null;
          growth_annual_pct: number | null;
          investment_score: number | null;
          updated_at: string;
        };
        Insert: {
          set_id: string;
          market_value_new?: number | null;
          market_value_used?: number | null;
          pct_change_7d?: number | null;
          pct_change_30d?: number | null;
          pct_change_90d?: number | null;
          growth_annual_pct?: number | null;
          investment_score?: number | null;
          updated_at?: string;
        };
        Update: {
          set_id?: string;
          market_value_new?: number | null;
          market_value_used?: number | null;
          pct_change_7d?: number | null;
          pct_change_30d?: number | null;
          pct_change_90d?: number | null;
          growth_annual_pct?: number | null;
          investment_score?: number | null;
          updated_at?: string;
        };
      };
      colors: {
        Row: {
          id: number;
          name: string;
          rgb: string | null;
          is_trans: boolean;
        };
        Insert: {
          id: number;
          name: string;
          rgb?: string | null;
          is_trans?: boolean;
        };
        Update: {
          id?: number;
          name?: string;
          rgb?: string | null;
          is_trans?: boolean;
        };
      };
      parts: {
        Row: {
          part_num: string;
          name: string;
          category_id: number | null;
          img_url: string | null;
        };
        Insert: {
          part_num: string;
          name: string;
          category_id?: number | null;
          img_url?: string | null;
        };
        Update: {
          part_num?: string;
          name?: string;
          category_id?: number | null;
          img_url?: string | null;
        };
      };
      minifigs: {
        Row: {
          fig_num: string;
          name: string;
          num_parts: number | null;
          img_url: string | null;
        };
        Insert: {
          fig_num: string;
          name: string;
          num_parts?: number | null;
          img_url?: string | null;
        };
        Update: {
          fig_num?: string;
          name?: string;
          num_parts?: number | null;
          img_url?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          provider: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          provider?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          provider?: string | null;
          created_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
        };
      };
      collection_items: {
        Row: {
          id: string;
          collection_id: string;
          set_id: string;
          condition: ItemCondition;
          purchase_price: number | null;
          purchase_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          collection_id: string;
          set_id: string;
          condition?: ItemCondition;
          purchase_price?: number | null;
          purchase_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          collection_id?: string;
          set_id?: string;
          condition?: ItemCondition;
          purchase_price?: number | null;
          purchase_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      set_status: SetStatus;
      item_condition: ItemCondition;
    };
  };
}
