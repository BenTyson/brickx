# BrickX — External API Reference

## Rebrickable (PRIMARY — Catalog)

|                |                                                                    |
| -------------- | ------------------------------------------------------------------ |
| **Base URL**   | `https://rebrickable.com/api/v3/lego/`                             |
| **Auth**       | API key via `Authorization: key {KEY}` header                      |
| **Env Var**    | `REBRICKABLE_API_KEY`                                              |
| **Rate Limit** | Not formally specified; use CSV bulk downloads for initial seeding |
| **Priority**   | Primary catalog source                                             |

**Key Endpoints:**

- `GET /sets/` — List sets (paginated, filterable by theme/year)
- `GET /sets/{set_num}/` — Single set details
- `GET /themes/` — All themes
- `GET /colors/` — All colors
- `GET /parts/` — Parts catalog

**Bulk Downloads:** `https://rebrickable.com/downloads/` — CSV.gz files for sets, themes, parts, colors, minifigs. Preferred for initial seeding (avoids rate limits).

**Response Shape (set):**

```json
{
  "set_num": "75192-1",
  "name": "Millennium Falcon",
  "year": 2017,
  "theme_id": 158,
  "num_parts": 7541,
  "set_img_url": "...",
  "set_url": "..."
}
```

## BrickLink (PRIMARY — Pricing)

|                |                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------- |
| **Base URL**   | `https://api.bricklink.com/api/store/v1/`                                                          |
| **Auth**       | OAuth 1.0a (HMAC-SHA1)                                                                             |
| **Env Vars**   | `BRICKLINK_CONSUMER_KEY`, `BRICKLINK_CONSUMER_SECRET`, `BRICKLINK_TOKEN`, `BRICKLINK_TOKEN_SECRET` |
| **Rate Limit** | 5,000 requests/day                                                                                 |
| **Priority**   | Primary pricing source                                                                             |

**Key Endpoints:**

- `GET /items/SET/{set_num}/price_guide` — Price guide (avg, min, max, qty for new/used)

**Query Params:** `guide_type=sold` (completed sales), `new_or_used=N` or `U`, `region=north_america`

**Response Shape (price guide):**

```json
{
  "item": { "no": "75192-1", "type": "SET" },
  "new_or_used": "N",
  "avg_price": "719.99",
  "min_price": "650.00",
  "max_price": "850.00",
  "qty_avg_price": "725.50",
  "total_quantity": 42
}
```

## BrickEconomy (SUPPLEMENTARY — Analytics)

|                |                                                    |
| -------------- | -------------------------------------------------- |
| **Base URL**   | `https://www.brickeconomy.com/api/v1/`             |
| **Auth**       | API key via header                                 |
| **Env Var**    | `BRICKECONOMY_API_KEY`                             |
| **Rate Limit** | ~60 req/min (estimated)                            |
| **Priority**   | Supplementary — investment analytics, growth rates |

**Key Endpoints:**

- `GET /set/{set_num}` — Set valuation, growth rate, investment rating

**Response Shape:**

```json
{
  "set_num": "75192-1",
  "retail_price": 849.99,
  "value_new": 925.0,
  "growth_percentage": 8.8,
  "annual_growth": 11.2,
  "rating": "A+"
}
```

## BrickOwl (SUPPLEMENTARY — Secondary Pricing)

|                |                                         |
| -------------- | --------------------------------------- |
| **Base URL**   | `https://api.brickowl.com/v1/`          |
| **Auth**       | API key via `key` query parameter       |
| **Env Var**    | `BRICKOWL_API_KEY`                      |
| **Rate Limit** | ~100 req/min (estimated)                |
| **Priority**   | Supplementary — cross-reference pricing |

**Key Endpoints:**

- `GET /catalog/id_lookup` — Find BrickOwl ID from set number
- `GET /catalog/pricing` — Current asking prices

**Response Shape:**

```json
{ "boids": ["123456-1"], "type": "Set" }
```

## API Priority & Fallback Strategy

1. **Rebrickable** — Always used for catalog data (sets, themes, parts, colors, minifigs)
2. **BrickLink** — Primary pricing source; highest data quality for sold prices
3. **BrickEconomy** — Investment analytics overlay; supplements BrickLink pricing
4. **BrickOwl** — Fallback pricing when BrickLink data is unavailable or stale
