-- Daily snapshot of each user's portfolio value. Feeds the historical chart
-- on /portfolio and powers performance attribution queries.
CREATE TABLE portfolio_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  total_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
  cost_basis NUMERIC(12, 2) NOT NULL DEFAULT 0,
  item_count INTEGER NOT NULL DEFAULT 0,
  by_theme_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  by_condition_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, snapshot_date)
);

CREATE INDEX idx_portfolio_snapshots_user_date
  ON portfolio_snapshots(user_id, snapshot_date DESC);

ALTER TABLE portfolio_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own portfolio snapshots"
  ON portfolio_snapshots FOR SELECT
  USING (auth.uid() = user_id);
