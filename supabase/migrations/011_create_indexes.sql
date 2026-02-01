CREATE INDEX IF NOT EXISTS idx_sets_name ON sets (name);
CREATE INDEX IF NOT EXISTS idx_sets_theme_id ON sets (theme_id);
CREATE INDEX IF NOT EXISTS idx_sets_year ON sets (year);
CREATE INDEX IF NOT EXISTS idx_sets_status ON sets (status);
CREATE INDEX IF NOT EXISTS idx_set_prices_set_fetched ON set_prices (set_id, fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON collection_items (collection_id);
