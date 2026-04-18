export type SetStatus = "available" | "retired" | "unreleased";
export type ItemCondition = "new" | "used";
export type AlertType = "price_drop" | "price_target" | "value_exceeded";
export type AlertStatus = "active" | "triggered" | "dismissed";

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
        Relationships: [
          {
            foreignKeyName: "themes_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "themes";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "sets_theme_id_fkey";
            columns: ["theme_id"];
            isOneToOne: false;
            referencedRelation: "themes";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "set_prices_set_id_fkey";
            columns: ["set_id"];
            isOneToOne: false;
            referencedRelation: "sets";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "set_market_values_set_id_fkey";
            columns: ["set_id"];
            isOneToOne: true;
            referencedRelation: "sets";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          provider: string | null;
          created_at: string;
          onboarded_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          provider?: string | null;
          created_at?: string;
          onboarded_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          provider?: string | null;
          created_at?: string;
          onboarded_at?: string | null;
        };
        Relationships: [];
      };
      import_history: {
        Row: {
          id: string;
          user_id: string;
          format: "csv" | "bricklink_xml" | "bricklink_csv";
          filename: string | null;
          collection_id: string | null;
          rows_total: number;
          rows_imported: number;
          rows_skipped: number;
          rows_error: number;
          error_details: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          format: "csv" | "bricklink_xml" | "bricklink_csv";
          filename?: string | null;
          collection_id?: string | null;
          rows_total?: number;
          rows_imported?: number;
          rows_skipped?: number;
          rows_error?: number;
          error_details?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          format?: "csv" | "bricklink_xml" | "bricklink_csv";
          filename?: string | null;
          collection_id?: string | null;
          rows_total?: number;
          rows_imported?: number;
          rows_skipped?: number;
          rows_error?: number;
          error_details?: Record<string, unknown> | null;
        };
        Relationships: [
          {
            foreignKeyName: "import_history_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "import_history_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "collections_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_items_set_id_fkey";
            columns: ["set_id"];
            isOneToOne: false;
            referencedRelation: "sets";
            referencedColumns: ["id"];
          },
        ];
      };
      price_alerts: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          set_id: string;
          alert_type: AlertType;
          target_price?: number | null;
          threshold_pct?: number | null;
          is_read?: boolean;
          status?: AlertStatus;
          triggered_at?: string | null;
          triggered_value?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          set_id?: string;
          alert_type?: AlertType;
          target_price?: number | null;
          threshold_pct?: number | null;
          is_read?: boolean;
          status?: AlertStatus;
          triggered_at?: string | null;
          triggered_value?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "price_alerts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "price_alerts_set_id_fkey";
            columns: ["set_id"];
            isOneToOne: false;
            referencedRelation: "sets";
            referencedColumns: ["id"];
          },
        ];
      };
      portfolio_snapshots: {
        Row: {
          id: string;
          user_id: string;
          snapshot_date: string;
          total_value: number;
          cost_basis: number;
          item_count: number;
          by_theme_json: Record<string, number>;
          by_condition_json: Record<string, number>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          snapshot_date: string;
          total_value?: number;
          cost_basis?: number;
          item_count?: number;
          by_theme_json?: Record<string, number>;
          by_condition_json?: Record<string, number>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          snapshot_date?: string;
          total_value?: number;
          cost_basis?: number;
          item_count?: number;
          by_theme_json?: Record<string, number>;
          by_condition_json?: Record<string, number>;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "portfolio_snapshots_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      notification_preferences: {
        Row: {
          user_id: string;
          email_alerts: boolean;
          price_drop_alerts: boolean;
          value_exceeded_alerts: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email_alerts?: boolean;
          price_drop_alerts?: boolean;
          value_exceeded_alerts?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          email_alerts?: boolean;
          price_drop_alerts?: boolean;
          value_exceeded_alerts?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      set_status: SetStatus;
      item_condition: ItemCondition;
      alert_type: AlertType;
      alert_status: AlertStatus;
    };
  };
}
