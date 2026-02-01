CREATE TABLE IF NOT EXISTS parts (
  part_num TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id INTEGER,
  img_url TEXT
);
