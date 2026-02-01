-- Enable RLS on all tables
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE set_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE set_market_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE minifigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

-- Public read access for catalog tables
CREATE POLICY IF NOT EXISTS "Public read themes" ON themes FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public read sets" ON sets FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public read set_prices" ON set_prices FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public read set_market_values" ON set_market_values FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public read colors" ON colors FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public read parts" ON parts FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public read minifigs" ON minifigs FOR SELECT USING (true);

-- Users: own row only
CREATE POLICY IF NOT EXISTS "Users select own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "Users update own" ON users FOR UPDATE USING (auth.uid() = id);

-- Collections: own rows only
CREATE POLICY IF NOT EXISTS "Collections select own" ON collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Collections insert own" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Collections update own" ON collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Collections delete own" ON collections FOR DELETE USING (auth.uid() = user_id);

-- Collection items: via collection ownership
CREATE POLICY IF NOT EXISTS "Collection items select own" ON collection_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid()));
CREATE POLICY IF NOT EXISTS "Collection items insert own" ON collection_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid()));
CREATE POLICY IF NOT EXISTS "Collection items update own" ON collection_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid()));
CREATE POLICY IF NOT EXISTS "Collection items delete own" ON collection_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid()));
