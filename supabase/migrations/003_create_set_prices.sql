CREATE TABLE IF NOT EXISTS set_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id TEXT NOT NULL REFERENCES sets(id),
  source TEXT NOT NULL CHECK (source IN ('bricklink', 'brickeconomy', 'brickowl')),
  new_avg NUMERIC(10, 2),
  new_min NUMERIC(10, 2),
  new_max NUMERIC(10, 2),
  new_qty_sold INTEGER,
  used_avg NUMERIC(10, 2),
  used_min NUMERIC(10, 2),
  used_max NUMERIC(10, 2),
  used_qty_sold INTEGER,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
