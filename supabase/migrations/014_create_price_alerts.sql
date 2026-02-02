-- Price alerts table
CREATE TYPE alert_type AS ENUM ('price_drop', 'price_target', 'value_exceeded');
CREATE TYPE alert_status AS ENUM ('active', 'triggered', 'dismissed');

CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  set_id TEXT NOT NULL REFERENCES sets(id) ON DELETE CASCADE,
  alert_type alert_type NOT NULL,
  target_price NUMERIC(10, 2),
  threshold_pct NUMERIC(5, 2),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  status alert_status NOT NULL DEFAULT 'active',
  triggered_at TIMESTAMPTZ,
  triggered_value NUMERIC(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_user_status ON price_alerts(user_id, status);
CREATE INDEX idx_price_alerts_set_id ON price_alerts(set_id);

-- RLS
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON price_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own alerts"
  ON price_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON price_alerts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON price_alerts FOR DELETE
  USING (auth.uid() = user_id);
