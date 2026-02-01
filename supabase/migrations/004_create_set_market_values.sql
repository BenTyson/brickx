CREATE TABLE IF NOT EXISTS set_market_values (
  set_id TEXT PRIMARY KEY REFERENCES sets(id),
  market_value_new NUMERIC(10, 2),
  market_value_used NUMERIC(10, 2),
  pct_change_7d NUMERIC(6, 2),
  pct_change_30d NUMERIC(6, 2),
  pct_change_90d NUMERIC(6, 2),
  growth_annual_pct NUMERIC(6, 2),
  investment_score NUMERIC(5, 2),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
