# BrickX — Database Schema Reference

## Enums

```sql
set_status: 'available' | 'retired' | 'unreleased'
item_condition: 'new' | 'used'
alert_type: 'price_drop' | 'price_target' | 'value_exceeded'
alert_status: 'active' | 'triggered' | 'dismissed'
```

## Tables

### themes

| Column     | Type        | Constraints               |
| ---------- | ----------- | ------------------------- |
| id         | INTEGER     | PK                        |
| name       | TEXT        | NOT NULL                  |
| parent_id  | INTEGER     | FK → themes(id), nullable |
| created_at | TIMESTAMPTZ | DEFAULT now()             |

### sets

| Column       | Type          | Constraints         |
| ------------ | ------------- | ------------------- |
| id           | TEXT          | PK (e.g. "75192-1") |
| name         | TEXT          | NOT NULL            |
| year         | INTEGER       | NOT NULL            |
| theme_id     | INTEGER       | FK → themes(id)     |
| num_parts    | INTEGER       |                     |
| num_minifigs | INTEGER       |                     |
| img_url      | TEXT          |                     |
| set_url      | TEXT          |                     |
| msrp_usd     | NUMERIC(10,2) |                     |
| status       | set_status    | DEFAULT 'available' |
| created_at   | TIMESTAMPTZ   | DEFAULT now()       |
| updated_at   | TIMESTAMPTZ   | DEFAULT now()       |

### set_prices (append-only)

| Column        | Type          | Constraints                                      |
| ------------- | ------------- | ------------------------------------------------ |
| id            | UUID          | PK, DEFAULT gen_random_uuid()                    |
| set_id        | TEXT          | FK → sets(id), NOT NULL                          |
| source        | TEXT          | CHECK IN ('bricklink','brickeconomy','brickowl') |
| new_avg       | NUMERIC(10,2) |                                                  |
| new_min       | NUMERIC(10,2) |                                                  |
| new_max       | NUMERIC(10,2) |                                                  |
| new_qty_sold  | INTEGER       |                                                  |
| used_avg      | NUMERIC(10,2) |                                                  |
| used_min      | NUMERIC(10,2) |                                                  |
| used_max      | NUMERIC(10,2) |                                                  |
| used_qty_sold | INTEGER       |                                                  |
| fetched_at    | TIMESTAMPTZ   | DEFAULT now()                                    |

### set_market_values (computed)

| Column            | Type          | Constraints       |
| ----------------- | ------------- | ----------------- |
| set_id            | TEXT          | PK, FK → sets(id) |
| market_value_new  | NUMERIC(10,2) |                   |
| market_value_used | NUMERIC(10,2) |                   |
| pct_change_7d     | NUMERIC(6,2)  |                   |
| pct_change_30d    | NUMERIC(6,2)  |                   |
| pct_change_90d    | NUMERIC(6,2)  |                   |
| growth_annual_pct | NUMERIC(6,2)  |                   |
| investment_score  | NUMERIC(5,2)  |                   |
| updated_at        | TIMESTAMPTZ   | DEFAULT now()     |

### colors

| Column   | Type    | Constraints   |
| -------- | ------- | ------------- |
| id       | INTEGER | PK            |
| name     | TEXT    | NOT NULL      |
| rgb      | TEXT    |               |
| is_trans | BOOLEAN | DEFAULT false |

### parts

| Column      | Type    | Constraints |
| ----------- | ------- | ----------- |
| part_num    | TEXT    | PK          |
| name        | TEXT    | NOT NULL    |
| category_id | INTEGER |             |
| img_url     | TEXT    |             |

### minifigs

| Column    | Type    | Constraints |
| --------- | ------- | ----------- |
| fig_num   | TEXT    | PK          |
| name      | TEXT    | NOT NULL    |
| num_parts | INTEGER |             |
| img_url   | TEXT    |             |

### users

| Column     | Type        | Constraints      |
| ---------- | ----------- | ---------------- |
| id         | UUID        | PK               |
| email      | TEXT        | UNIQUE, NOT NULL |
| name       | TEXT        |                  |
| avatar_url | TEXT        |                  |
| provider   | TEXT        |                  |
| created_at | TIMESTAMPTZ | DEFAULT now()    |

### collections

| Column     | Type        | Constraints                                |
| ---------- | ----------- | ------------------------------------------ |
| id         | UUID        | PK, DEFAULT gen_random_uuid()              |
| user_id    | UUID        | FK → users(id) ON DELETE CASCADE, NOT NULL |
| name       | TEXT        | NOT NULL                                   |
| created_at | TIMESTAMPTZ | DEFAULT now()                              |

### collection_items

| Column         | Type           | Constraints                                      |
| -------------- | -------------- | ------------------------------------------------ |
| id             | UUID           | PK, DEFAULT gen_random_uuid()                    |
| collection_id  | UUID           | FK → collections(id) ON DELETE CASCADE, NOT NULL |
| set_id         | TEXT           | FK → sets(id), NOT NULL                          |
| condition      | item_condition | DEFAULT 'new'                                    |
| purchase_price | NUMERIC(10,2)  |                                                  |
| purchase_date  | DATE           |                                                  |
| notes          | TEXT           |                                                  |
| created_at     | TIMESTAMPTZ    | DEFAULT now()                                    |
| updated_at     | TIMESTAMPTZ    | DEFAULT now()                                    |

### price_alerts

| Column          | Type          | Constraints                                |
| --------------- | ------------- | ------------------------------------------ |
| id              | UUID          | PK, DEFAULT gen_random_uuid()              |
| user_id         | UUID          | FK → users(id) ON DELETE CASCADE, NOT NULL |
| set_id          | TEXT          | FK → sets(id) ON DELETE CASCADE, NOT NULL  |
| alert_type      | alert_type    | NOT NULL                                   |
| target_price    | NUMERIC(10,2) |                                            |
| threshold_pct   | NUMERIC(5,2)  |                                            |
| is_read         | BOOLEAN       | DEFAULT false                              |
| status          | alert_status  | DEFAULT 'active'                           |
| triggered_at    | TIMESTAMPTZ   |                                            |
| triggered_value | NUMERIC(10,2) |                                            |
| created_at      | TIMESTAMPTZ   | DEFAULT now()                              |
| updated_at      | TIMESTAMPTZ   | DEFAULT now()                              |

### notification_preferences

| Column                | Type        | Constraints                          |
| --------------------- | ----------- | ------------------------------------ |
| user_id               | UUID        | PK, FK → users(id) ON DELETE CASCADE |
| email_alerts          | BOOLEAN     | DEFAULT true                         |
| price_drop_alerts     | BOOLEAN     | DEFAULT true                         |
| value_exceeded_alerts | BOOLEAN     | DEFAULT true                         |
| created_at            | TIMESTAMPTZ | DEFAULT now()                        |
| updated_at            | TIMESTAMPTZ | DEFAULT now()                        |

## Relationships

```
themes.parent_id → themes.id (self-referencing)
sets.theme_id → themes.id
set_prices.set_id → sets.id
set_market_values.set_id → sets.id
collections.user_id → users.id (CASCADE)
collection_items.collection_id → collections.id (CASCADE)
collection_items.set_id → sets.id
price_alerts.user_id → users.id (CASCADE)
price_alerts.set_id → sets.id (CASCADE)
notification_preferences.user_id → users.id (CASCADE)
```

## Indexes

| Index                           | Table            | Columns                 |
| ------------------------------- | ---------------- | ----------------------- |
| idx_sets_name                   | sets             | name                    |
| idx_sets_theme_id               | sets             | theme_id                |
| idx_sets_year                   | sets             | year                    |
| idx_sets_status                 | sets             | status                  |
| idx_set_prices_set_fetched      | set_prices       | set_id, fetched_at DESC |
| idx_collection_items_collection | collection_items | collection_id           |
| idx_price_alerts_user_id        | price_alerts     | user_id                 |
| idx_price_alerts_user_status    | price_alerts     | user_id, status         |
| idx_price_alerts_set_id         | price_alerts     | set_id                  |

## RLS Policies

**Public read** (no auth required): themes, sets, set_prices, set_market_values, colors, parts, minifigs

**User-scoped CRUD** (auth.uid() = user_id): users (SELECT/INSERT/UPDATE own row), collections (full CRUD own rows), collection_items (full CRUD via collection ownership), price_alerts (full CRUD own rows), notification_preferences (SELECT/INSERT/UPDATE own row)

## Triggers

### handle_new_user() (migration 013)

- **Fires:** AFTER INSERT on `auth.users`
- **Action:** UPSERTS into `public.users` using `raw_user_meta_data` for name/avatar/provider
- **Security:** SECURITY DEFINER, `SET search_path = ''`
- **Conflict:** ON CONFLICT (id) DO UPDATE — handles re-registrations
