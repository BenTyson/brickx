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
DROP POLICY IF EXISTS "Public read themes" ON themes;
CREATE POLICY "Public read themes" ON themes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read sets" ON sets;
CREATE POLICY "Public read sets" ON sets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read set_prices" ON set_prices;
CREATE POLICY "Public read set_prices" ON set_prices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read set_market_values" ON set_market_values;
CREATE POLICY "Public read set_market_values" ON set_market_values FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read colors" ON colors;
CREATE POLICY "Public read colors" ON colors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read parts" ON parts;
CREATE POLICY "Public read parts" ON parts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read minifigs" ON minifigs;
CREATE POLICY "Public read minifigs" ON minifigs FOR SELECT USING (true);

-- Users: own row only
DROP POLICY IF EXISTS "Users select own" ON users;
CREATE POLICY "Users select own" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own" ON users;
CREATE POLICY "Users update own" ON users FOR UPDATE USING (auth.uid() = id);

-- Collections: own rows only
DROP POLICY IF EXISTS "Collections select own" ON collections;
CREATE POLICY "Collections select own" ON collections FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Collections insert own" ON collections;
CREATE POLICY "Collections insert own" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Collections update own" ON collections;
CREATE POLICY "Collections update own" ON collections FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Collections delete own" ON collections;
CREATE POLICY "Collections delete own" ON collections FOR DELETE USING (auth.uid() = user_id);

-- Collection items: via collection ownership
DROP POLICY IF EXISTS "Collection items select own" ON collection_items;
CREATE POLICY "Collection items select own" ON collection_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid()));

DROP POLICY IF EXISTS "Collection items insert own" ON collection_items;
CREATE POLICY "Collection items insert own" ON collection_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid()));

DROP POLICY IF EXISTS "Collection items update own" ON collection_items;
CREATE POLICY "Collection items update own" ON collection_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid()));

DROP POLICY IF EXISTS "Collection items delete own" ON collection_items;
CREATE POLICY "Collection items delete own" ON collection_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid()));
