# BrickX — Tech Stack & Conventions

## Tech Stack

| Layer     | Technology                                 |
| --------- | ------------------------------------------ |
| Framework | Next.js 15 (App Router)                    |
| Language  | TypeScript (strict)                        |
| Styling   | Tailwind CSS v4 + shadcn/ui (new-york)     |
| Theming   | next-themes (dark-first, class strategy)   |
| Database  | Supabase (PostgreSQL)                      |
| Auth      | Supabase Auth (Google/GitHub OAuth)        |
| Charting  | recharts (React chart library)             |
| Dev Port  | 5699                                       |
| Testing   | vitest (globals, node environment)         |
| Scripts   | tsx (for standalone scripts in `scripts/`) |

## Directory Structure

```
brickx/
├── docs/                    # Project documentation (agent-optimized)
│   ├── session-start.md     # Agent entry point
│   ├── sessions.md          # Session tracker
│   ├── schema.md            # Database schema reference
│   ├── architecture.md      # This file
│   ├── api-integrations.md  # External API details
│   └── project/overview.md  # Business context
├── scripts/                 # Standalone TypeScript scripts (run with tsx)
│   ├── migrate.ts           # Database migration runner
│   ├── download-csvs.ts     # Download Rebrickable CSV.gz files to data/
│   ├── seed-catalog.ts      # Parse CSVs, upsert into DB tables
│   ├── seed-prices.ts       # Fetch prices from BrickLink/BrickEconomy/BrickOwl
│   ├── seed.ts              # Orchestrator: download → catalog → prices
│   └── refresh-prices.ts    # Cron-callable: refresh stale price data
├── supabase/
│   └── migrations/          # SQL migration files (001-012)
├── data/                    # Downloaded data files (gitignored)
├── src/
│   ├── app/                 # Next.js App Router pages and routes
│   │   ├── api/             # API route handlers
│   │   ├── sets/            # Catalog & detail pages
│   │   │   ├── layout.tsx   # Shared layout (SiteHeader + main + SiteFooter)
│   │   │   ├── page.tsx     # Catalog browse: search, filter, sort, paginate
│   │   │   ├── loading.tsx  # Catalog skeleton loading state
│   │   │   └── [id]/        # Set detail page
│   │   │       ├── page.tsx     # Detail: hero, market stats, price chart, related sets
│   │   │       ├── loading.tsx  # Detail skeleton loading state
│   │   │       └── not-found.tsx # Set-specific 404
│   │   ├── not-found.tsx    # Global 404 page
│   │   ├── globals.css      # BrickX design tokens (OKLCH), shadcn CSS variables
│   │   ├── layout.tsx       # Root layout (ThemeProvider, metadata)
│   │   └── page.tsx         # Landing page (composed from sections)
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui primitives (button, badge, card, sheet, etc.)
│   │   ├── catalog/         # Catalog page components (search, sort, filters, grid, pagination)
│   │   ├── detail/          # Detail page components (breadcrumb, stats grid, price chart, related sets)
│   │   ├── landing/         # Landing page sections (hero, stats, features, etc.)
│   │   ├── logo.tsx         # BrickX logo (SVG, full/icon variants)
│   │   ├── status-badge.tsx # Set status badge (available/retired/etc.)
│   │   ├── price-change.tsx # Price change with colored arrows
│   │   ├── set-card.tsx     # LEGO set card with pricing
│   │   ├── stat-card.tsx    # Stat card with label, value, delta
│   │   ├── site-header.tsx  # Sticky nav with backdrop-blur
│   │   ├── mobile-nav.tsx   # Sheet-based mobile navigation
│   │   ├── site-footer.tsx  # 4-column responsive footer
│   │   ├── page-container.tsx # max-w-7xl page wrapper
│   │   └── theme-provider.tsx # next-themes wrapper
│   └── lib/
│       ├── mock-data.ts     # Mock LEGO set data (CatalogSet shape, used by landing page)
│       ├── queries/         # Server-side data access (Supabase queries)
│       │   ├── index.ts     # Barrel export
│       │   ├── sets.ts      # fetchCatalogSets, parseCatalogSearchParams, fetchFilterOptions
│       │   └── set-detail.ts # fetchSetDetail, fetchPriceHistory, fetchRelatedSets
│       ├── supabase/        # Supabase client modules
│       │   ├── client.ts    # Browser client (NEXT_PUBLIC_ vars)
│       │   ├── server.ts    # Server client (cookie-based)
│       │   └── admin.ts     # Admin client (service role, bypasses RLS)
│       ├── services/        # API clients and business logic
│       │   ├── base-api-client.ts  # Generic HTTP client (retry, backoff, rate limiting)
│       │   ├── rebrickable.ts      # Rebrickable API (catalog)
│       │   ├── bricklink.ts        # BrickLink API (OAuth1 pricing)
│       │   ├── brickeconomy.ts     # BrickEconomy API (valuations)
│       │   ├── brickowl.ts         # BrickOwl API (secondary pricing)
│       │   ├── price-aggregator.ts # Weighted price aggregation + investment scoring
│       │   └── __tests__/          # Service unit tests (vitest)
│       ├── types/           # TypeScript type definitions
│       │   ├── database.ts         # Supabase Database type
│       │   ├── catalog.ts          # CatalogSet, CatalogSearchParams, CatalogResult, PriceHistoryPoint, CatalogFilterOptions
│       │   ├── api-common.ts       # ApiError, PaginatedResponse, BaseApiClientConfig
│       │   ├── rebrickable.ts      # Rebrickable response types
│       │   ├── bricklink.ts        # BrickLink response types
│       │   ├── brickeconomy.ts     # BrickEconomy response types
│       │   └── brickowl.ts         # BrickOwl response types
│       ├── utils/           # Shared utilities
│       │   ├── cn.ts               # Tailwind class merge utility (shadcn)
│       │   ├── sleep.ts            # Promise-based sleep
│       │   ├── logger.ts           # Structured JSON logger
│       │   ├── rate-limiter.ts     # Token-bucket rate limiter
│       │   ├── oauth1.ts           # OAuth 1.0a HMAC-SHA1 signing
│       │   └── __tests__/          # Unit tests (vitest)
│       └── env.ts           # Zod environment validation
└── .env.example             # Environment variable template
```

## Naming Conventions

- **Files:** kebab-case (`rate-limiter.ts`, `base-api-client.ts`)
- **Components:** kebab-case files, PascalCase exports (`set-card.tsx` → `SetCard`)
- **Types:** PascalCase (`SetRow`, `PriceInsert`)
- **Constants:** UPPER_SNAKE_CASE
- **Database tables:** snake_case plural (`set_prices`, `collection_items`)
- **Database columns:** snake_case (`num_parts`, `fetched_at`)

## Component Organization

| Directory                 | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| `src/components/ui/`      | shadcn/ui primitives (auto-generated)            |
| `src/components/`         | BrickX custom components (reusable across pages) |
| `src/components/catalog/` | Catalog page components (search, filters, grid)  |
| `src/components/detail/`  | Set detail page components (breadcrumb, stats, chart, related) |
| `src/components/landing/` | Landing page sections (page-specific)            |

**shadcn/ui config:** `components.json` at project root. Utils alias: `@/lib/utils/cn` (avoids conflict with `src/lib/utils/` directory).

**Theme:** Dark-first via `next-themes` (`defaultTheme="dark"`, `attribute="class"`). Design tokens as OKLCH CSS variables in `globals.css`. Custom BrickX tokens: `--success` (green), `--warning` (amber), `--info` (purple).

## Supabase Client Usage

| Client      | Import                               | Use When                            |
| ----------- | ------------------------------------ | ----------------------------------- |
| `client.ts` | Browser/client components            | Client-side data fetching           |
| `server.ts` | Server components, route handlers    | SSR, API routes (respects RLS)      |
| `admin.ts`  | Scripts, cron jobs, admin operations | Bypasses RLS, uses service role key |

**Rules:**

- Never import `admin.ts` in client-side code
- Server components should use `server.ts` for user-scoped queries
- Scripts in `scripts/` use `admin.ts` for bulk operations

## Environment Variables

- `NEXT_PUBLIC_` prefix: Exposed to browser (Supabase URL, anon key)
- No prefix: Server-only (service role key, API keys, DATABASE_URL)
- Validated at startup via `src/lib/env.ts` using Zod
- Template in `.env.example`, actual values in `.env.local` (gitignored)

## Script Execution

All standalone scripts use `tsx` and are run from project root:

```bash
npm run db:migrate            # Run database migrations
npm run db:seed               # Full pipeline: download CSVs → seed catalog → seed prices
npm run db:seed:catalog       # Seed catalog only (requires CSVs in data/)
npm run db:seed:prices        # Seed prices only (requires API keys)
npm run db:download-csvs      # Download Rebrickable CSVs to data/
npm run db:refresh-prices     # Refresh stale prices (cron-callable)
```

Note: Scripts require `--env-file=.env.local` when run directly with `npx tsx`. The npm scripts handle this via tsx.
