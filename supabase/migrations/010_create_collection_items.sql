DO $$ BEGIN
  CREATE TYPE item_condition AS ENUM ('new', 'used');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  set_id TEXT NOT NULL REFERENCES sets(id),
  condition item_condition NOT NULL DEFAULT 'new',
  purchase_price NUMERIC(10, 2),
  purchase_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
