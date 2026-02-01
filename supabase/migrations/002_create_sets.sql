DO $$ BEGIN
  CREATE TYPE set_status AS ENUM ('available', 'retired', 'unreleased');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS sets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  theme_id INTEGER REFERENCES themes(id),
  num_parts INTEGER,
  num_minifigs INTEGER,
  img_url TEXT,
  set_url TEXT,
  msrp_usd NUMERIC(10, 2),
  status set_status NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
