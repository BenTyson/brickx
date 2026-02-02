# BrickX — Tech Stack & Conventions

## Tech Stack

| Layer     | Technology                                 |
| --------- | ------------------------------------------ |
| Framework | Next.js 16 (App Router)                    |
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
│   └── migrations/          # SQL migration files (001-015)
├── data/                    # Downloaded data files (gitignored)
├── src/
│   ├── app/                 # Next.js App Router pages and routes
│   │   ├── api/             # API route handlers
│   │   ├── auth/callback/   # OAuth/email code exchange route
│   │   ├── (auth)/          # Auth route group (sign-in, sign-up) — centered layout
│   │   │   ├── layout.tsx
│   │   │   ├── sign-in/page.tsx
│   │   │   └── sign-up/page.tsx
│   │   ├── (app)/           # Auth-required route group — redirects to /sign-in
│   │   │   ├── layout.tsx
│   │   │   ├── alerts/      # Price alerts list + preferences
│   │   │   ├── collections/ # Collections list + detail pages
│   │   │   └── portfolio/   # Portfolio dashboard
│   │   ├── market/          # Market intelligence pages (public)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx         # Hub: category cards + trending preview
│   │   │   ├── trending/        # 7d/30d price movers
│   │   │   ├── retiring/        # Retired sets
│   │   │   ├── new-releases/    # Recent releases
│   │   │   └── top-investments/ # Highest investment scores
│   │   ├── sitemap.ts       # Dynamic sitemap (~26K set pages)
│   │   ├── robots.ts        # Robots.txt (disallow private routes)
│   │   ├── sets/            # Catalog & detail pages
│   │   │   ├── layout.tsx   # Shared layout (SiteHeader + main + SiteFooter)
│   │   │   ├── page.tsx     # Catalog browse: search, filter, sort, paginate
│   │   │   ├── loading.tsx  # Catalog skeleton loading state
│   │   │   └── [id]/        # Set detail page (+ AddToCollectionButton)
│   │   │       ├── page.tsx     # Detail: hero, market stats, price chart, related sets
│   │   │       ├── loading.tsx  # Detail skeleton loading state
│   │   │       └── not-found.tsx # Set-specific 404
│   │   ├── not-found.tsx    # Global 404 page
│   │   ├── globals.css      # BrickX design tokens (OKLCH), shadcn CSS variables
│   │   ├── layout.tsx       # Root layout (ThemeProvider, metadata)
│   │   └── page.tsx         # Landing page (composed from sections)
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui primitives (button, badge, card, sheet, dialog, dropdown-menu, avatar, tabs, switch, etc.)
│   │   ├── alerts/          # Alert components (notification-bell, alert-list, create-dialog, preferences)
│   │   ├── auth/            # Auth components (sign-in-form, sign-up-form, user-menu)
│   │   ├── catalog/         # Catalog page components (search, sort, filters, grid, pagination)
│   │   ├── collections/     # Collection components (card, dialogs, items table)
│   │   ├── detail/          # Detail page components (breadcrumb, stats, chart, related, add-to-collection)
│   │   ├── landing/         # Landing page sections (hero, stats, features, etc.)
│   │   ├── market/          # Market intelligence components (hub-card, period-toggle, price-filter, pagination)
│   │   ├── portfolio/       # Portfolio components (summary cards, breakdown table)
│   │   ├── json-ld.tsx      # Generic JSON-LD script injector
│   │   ├── logo.tsx         # BrickX logo (SVG, full/icon variants)
│   │   ├── status-badge.tsx # Set status badge (available/retired/etc.)
│   │   ├── price-change.tsx # Price change with colored arrows
│   │   ├── set-card.tsx     # LEGO set card with pricing
│   │   ├── stat-card.tsx    # Stat card with label, value, delta
│   │   ├── site-header.tsx  # Sticky nav with UserMenu (reactive auth state)
│   │   ├── mobile-nav.tsx   # Sheet-based mobile navigation with MobileUserMenu
│   │   ├── site-footer.tsx  # 4-column responsive footer
│   │   ├── page-container.tsx # max-w-7xl page wrapper
│   │   └── theme-provider.tsx # next-themes wrapper
│   └── lib/
│       ├── actions/         # Server actions
│       │   ├── auth.ts      # signOut()
│       │   ├── alerts.ts    # createPriceAlert, dismissAlert, markAlertRead, markAllAlertsRead, deleteAlert, updateNotificationPreferences
│       │   └── collections.ts # create/rename/delete collection, add/update/remove items
│       ├── mock-data.ts     # Mock LEGO set data (CatalogSet shape, used by landing page)
│       ├── queries/         # Server-side data access (Supabase queries)
│       │   ├── index.ts     # Barrel export
│       │   ├── helpers.ts   # Shared SetRow interface + flattenSetRow()
│       │   ├── sets.ts      # fetchCatalogSets, parseCatalogSearchParams, fetchFilterOptions
│       │   ├── set-detail.ts # fetchSetDetail, fetchPriceHistory, fetchRelatedSets
│       │   ├── collections.ts # fetchUserCollections, fetchCollectionDetail, fetchPortfolioSummary
│       │   ├── market.ts    # fetchTrendingSets, fetchRetiringSets, fetchNewReleases, fetchTopInvestments
│       │   └── alerts.ts    # fetchUserAlerts, fetchUnreadAlertCount, fetchNotificationPreferences
│       ├── supabase/        # Supabase client modules
│       │   ├── client.ts    # Browser client (NEXT_PUBLIC_ vars)
│       │   ├── server.ts    # Server client (cookie-based)
│       │   ├── admin.ts     # Admin client (service role, bypasses RLS)
│       │   └── auth.ts      # Server-side auth helpers (getUser, getUserProfile)
│       ├── services/        # API clients and business logic
│       │   ├── base-api-client.ts  # Generic HTTP client (retry, backoff, rate limiting)
│       │   ├── rebrickable.ts      # Rebrickable API (catalog)
│       │   ├── bricklink.ts        # BrickLink API (OAuth1 pricing)
│       │   ├── brickeconomy.ts     # BrickEconomy API (valuations)
│       │   ├── brickowl.ts         # BrickOwl API (secondary pricing)
│       │   ├── price-aggregator.ts # Weighted price aggregation + investment scoring
│       │   └── __tests__/          # Service unit tests (vitest)
│       ├── types/           # TypeScript type definitions
│       │   ├── database.ts         # Supabase Database type (12 tables, 4 enums)
│       │   ├── catalog.ts          # CatalogSet, CatalogSearchParams, CatalogResult, PriceHistoryPoint, CatalogFilterOptions
│       │   ├── alerts.ts           # PriceAlert, NotificationPreferences
│       │   ├── collection.ts       # CollectionSummary, CollectionItem, CollectionWithItems, PortfolioSummary
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
│   └── middleware.ts        # Supabase SSR session refresh middleware
└── .env.example             # Environment variable template (includes optional OAuth vars)
```

## Naming Conventions

- **Files:** kebab-case (`rate-limiter.ts`, `base-api-client.ts`)
- **Components:** kebab-case files, PascalCase exports (`set-card.tsx` → `SetCard`)
- **Types:** PascalCase (`SetRow`, `PriceInsert`)
- **Constants:** UPPER_SNAKE_CASE
- **Database tables:** snake_case plural (`set_prices`, `collection_items`)
- **Database columns:** snake_case (`num_parts`, `fetched_at`)

## Component Organization

| Directory                     | Purpose                                                                  |
| ----------------------------- | ------------------------------------------------------------------------ |
| `src/components/ui/`          | shadcn/ui primitives (auto-generated)                                    |
| `src/components/`             | BrickX custom components (reusable across pages)                         |
| `src/components/alerts/`      | Alert components (notification bell, alert list, create dialog, prefs)   |
| `src/components/auth/`        | Auth components (sign-in/up forms, user menu)                            |
| `src/components/catalog/`     | Catalog page components (search, filters, grid)                          |
| `src/components/collections/` | Collection components (card, CRUD dialogs, items table)                  |
| `src/components/detail/`      | Set detail page components (breadcrumb, stats, chart, add-to-collection) |
| `src/components/landing/`     | Landing page sections (page-specific)                                    |
| `src/components/market/`      | Market intelligence components (hub card, toggles, filters, pagination)  |
| `src/components/portfolio/`   | Portfolio components (summary cards, breakdown table)                    |

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
