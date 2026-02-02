# BrickX — Session Tracker

## Session 1A: Project Setup & DB Schema — **Complete**

**Goal:** Initialize Next.js 15 project, create documentation, set up 12 database migrations, configure Supabase clients, deliver health check endpoint.
**Prerequisites:** None
**Deliverables:** Next.js project on port 5699, 12 SQL migrations, Supabase client/server/admin modules, `/api/health` endpoint, 5 docs files
**Verification:** `npm run dev`, `npx tsc --noEmit`, `npm run lint`, `npm run db:migrate`, `GET /api/health`

## Session 1B: Infrastructure & API Services — **Complete**

**Goal:** Build rate limiter, base API client with retry/backoff, logger, OAuth1 util, and 4 API service modules with response types. Install vitest and write unit tests.
**Prerequisites:** 1A
**Deliverables:**

- `vitest.config.ts` — test runner config with `@/*` path alias
- `src/lib/utils/sleep.ts` — Promise-based sleep
- `src/lib/utils/logger.ts` — Structured JSON logger (debug/info/warn/error), level from `LOG_LEVEL`
- `src/lib/utils/rate-limiter.ts` — Token-bucket rate limiter (lazy refill), factories for BrickLink/BrickEconomy/BrickOwl
- `src/lib/utils/oauth1.ts` — OAuth 1.0a HMAC-SHA1 signing (node:crypto only)
- `src/lib/types/api-common.ts` — `ApiError`, `ApiErrorCode`, `PaginatedResponse<T>`, `BaseApiClientConfig`
- `src/lib/types/rebrickable.ts` — Set, Theme, Color, Part types, `SetListParams`
- `src/lib/types/bricklink.ts` — `BrickLinkApiResponse<T>`, `BrickLinkPriceGuide`, `BrickLinkCondition`
- `src/lib/types/brickeconomy.ts` — `BrickEconomySetValuation`
- `src/lib/types/brickowl.ts` — `BrickOwlIdLookupResponse`, `BrickOwlPricingResponse`
- `src/lib/services/base-api-client.ts` — Generic HTTP client (retry, backoff, rate limiting, timeout)
- `src/lib/services/rebrickable.ts` — `getSets`, `getSet`, `getThemes`, `getColors`, `getParts`
- `src/lib/services/bricklink.ts` — `BrickLinkApiClient` extends `BaseApiClient` for OAuth1, `getPriceGuide`
- `src/lib/services/brickeconomy.ts` — `getSetValuation`
- `src/lib/services/brickowl.ts` — `lookupId`, `getPricing`
- `src/lib/utils/__tests__/rate-limiter.test.ts` — 12 tests
- `src/lib/utils/__tests__/oauth1.test.ts` — 15 tests

**Verification:** `npx tsc --noEmit`, `npm test` (27 tests pass), `npm run lint`, `npm run format:check`

## Session 1C: Data Seeding & Aggregation — **Complete**

**Goal:** Download Rebrickable CSVs, seed 26K+ sets into DB, fetch prices from APIs, build price aggregation service, create cron-callable refresh script.
**Prerequisites:** 1A + 1B
**Deliverables:**

- `scripts/download-csvs.ts` — Downloads 5 CSV.gz from Rebrickable CDN, stream-decompresses to `data/`. `--force` flag to re-download.
- `scripts/seed-catalog.ts` — Parses CSVs, batch upserts into themes/colors/parts/minifigs/sets. Streaming for large tables, two-pass theme insertion for self-ref FK.
- `scripts/seed-prices.ts` — Fetches prices from BrickLink/BrickEconomy/BrickOwl for prioritized sets (tiered selection). Concurrent per-set fetching, graceful failure handling. `--limit N` CLI arg.
- `scripts/seed.ts` — Orchestrator: `downloadAll()` → `seedCatalog()` → `seedPrices()`. Price seeding auto-skipped without API keys.
- `scripts/refresh-prices.ts` — Cron-callable refresh: stale set prioritization (user collections → stale → no prices). `--max-sets N`, `--stale-hours N` CLI args.
- `src/lib/services/price-aggregator.ts` — Weighted average across sources (BL 0.50, BE 0.30, BO 0.20), pct change (7d/30d/90d), annualized growth, investment score (0–100).
- `src/lib/services/__tests__/price-aggregator.test.ts` — 25 unit tests for all pure computation functions.
- `src/lib/types/database.ts` — Added `Relationships` tuples to all table definitions (required by `@supabase/supabase-js` v2.93+).
- `supabase/migrations/012_create_rls_policies.sql` — Fixed `CREATE POLICY IF NOT EXISTS` syntax (not supported in PG < 15, use `DROP POLICY IF EXISTS` + `CREATE POLICY`).
- `package.json` — Added `csv-parse` dependency, 5 npm scripts (`db:seed`, `db:seed:catalog`, `db:seed:prices`, `db:download-csvs`, `db:refresh-prices`).

**Seeded data:** 488 themes, 275 colors, 60,815 parts, 16,532 minifigs, 26,095 sets. Price seeding deferred (no BrickLink/BrickEconomy/BrickOwl API access yet).
**Verification:** `npx tsc --noEmit`, `npm test` (52 tests pass), `npm run lint`, `npm run format:check`, `npm run db:seed` populates all catalog tables.

## Session 2: Design System & Landing Page — **Complete**

**Goal:** Initialize shadcn/ui with Tailwind v4, define BrickX dark-first color palette, build reusable UI components, create navigation shell, and compose responsive marketing landing page.
**Prerequisites:** 1A
**Deliverables:**

### Session 2A: shadcn/ui Init, Design Tokens & Theme Provider

- `components.json` — shadcn/ui config (new-york style, zinc base, CSS variables, Lucide icons)
- `src/lib/utils/cn.ts` — `cn()` utility (clsx + tailwind-merge), placed to avoid conflict with existing `src/lib/utils/` directory
- `src/app/globals.css` — Full shadcn CSS variable system with BrickX dark-first OKLCH palette, custom tokens (success, warning, info), custom scrollbar, smooth scroll, selection color
- `src/components/theme-provider.tsx` — `next-themes` wrapper (`defaultTheme="dark"`, `attribute="class"`, `enableSystem`, `disableTransitionOnChange`)
- `src/app/layout.tsx` — Updated with ThemeProvider, `suppressHydrationWarning`, enriched metadata (OpenGraph, Twitter, keywords)
- `src/components/ui/button.tsx` — shadcn Button (6 variants, 8 sizes)
- `src/components/ui/badge.tsx` — shadcn Badge (6 variants)
- `src/components/ui/card.tsx` — shadcn Card (7 sub-components)
- `src/components/ui/navigation-menu.tsx` — shadcn NavigationMenu
- `src/components/ui/sheet.tsx` — shadcn Sheet (slide-out drawer, 4 sides)
- `src/components/ui/separator.tsx` — shadcn Separator
- `src/components/ui/tooltip.tsx` — shadcn Tooltip
- `package.json` — Added next-themes, clsx, tailwind-merge, class-variance-authority, lucide-react, @radix-ui/\* packages

### Session 2B: Custom Components & Navigation Shell

- `src/components/logo.tsx` — SVG brick icon + "BrickX" text, `full` and `icon` variants
- `src/components/status-badge.tsx` — Colored badges for set status (available/retired/retiring-soon/exclusive/unreleased)
- `src/components/price-change.tsx` — Percentage change display with colored arrows (green up, red down)
- `src/components/set-card.tsx` — LEGO set card with placeholder image, status badge, pricing, and hover animation
- `src/components/stat-card.tsx` — Stat card with label, value, optional delta and icon
- `src/components/site-header.tsx` — Sticky top nav with backdrop-blur, desktop nav links, Sign In/Get Started buttons
- `src/components/mobile-nav.tsx` — Sheet-based mobile navigation (slide-from-left)
- `src/components/site-footer.tsx` — 4-column responsive footer (brand, product, resources, company)
- `src/components/page-container.tsx` — `max-w-7xl` page width wrapper
- `src/lib/mock-data.ts` — 8 hardcoded LEGO sets with pricing data for visual development

### Session 2C: Landing Page & Accessibility Polish

- `src/components/landing/hero-section.tsx` — Full-viewport hero with gradient, headline, CTAs, CSS dashboard mockup
- `src/components/landing/stats-section.tsx` — 4 stats: 26K+ sets, real-time pricing, ~11% returns, 100% free
- `src/components/landing/features-section.tsx` — 3 feature cards (Portfolio Tracking, Price Intelligence, Investment Insights)
- `src/components/landing/featured-sets-section.tsx` — Grid of 6 SetCards from mock data
- `src/components/landing/how-it-works-section.tsx` — 3 numbered steps with connecting line
- `src/components/landing/cta-section.tsx` — CTA card with gradient and "No credit card required"
- `src/app/page.tsx` — Composed landing page (SiteHeader → Hero → Stats → Features → FeaturedSets → HowItWorks → CTA → SiteFooter) with skip-to-content link

**Accessibility:** Skip-to-content link, proper heading hierarchy (single h1, h2 per section, h3 for sub-items), ARIA labels on nav/logo/icon buttons, 44px+ touch targets, high contrast ratios (foreground on background: 19.4:1)
**Verification:** `npx tsc --noEmit`, `npm test` (52 tests pass), `npm run lint`, `npm run format:check`, visual review at 375px/768px/1440px

## Session 3A: Data Access Layer & Primitives — **Complete**

**Goal:** Install charting dependency (recharts), add shadcn UI primitives, create typed data access layer for catalog and detail queries.
**Prerequisites:** 1C + 2
**Deliverables:**

- `recharts` npm dependency
- shadcn/ui components: input, select, skeleton, slider, checkbox, label, scroll-area, pagination, accordion
- `src/lib/types/catalog.ts` — `CatalogSet`, `CatalogSearchParams`, `CatalogSortField`, `CatalogResult`, `PriceHistoryPoint`, `CatalogFilterOptions`
- `src/lib/queries/sets.ts` — `fetchCatalogSets()` (Supabase joins + filters + sort + offset pagination, page size 24), `parseCatalogSearchParams()`, `fetchFilterOptions()`
- `src/lib/queries/set-detail.ts` — `fetchSetDetail()`, `fetchPriceHistory()`, `fetchRelatedSets()`
- `src/lib/queries/index.ts` — Barrel export

**Verification:** `npx tsc --noEmit`, `npm test` (52 tests pass), `npm run lint`, `npm run format:check`

## Session 3B: Catalog Page (`/sets`) — **Complete**

**Goal:** Full catalog browse page with search, filters, sorting, pagination — all state in URL params.
**Prerequisites:** 3A
**Deliverables:**

### Page & Loading

- `src/app/sets/page.tsx` — Server component: reads `searchParams` (Promise), fetches data in parallel, renders sidebar + grid layout. Metadata: "Browse LEGO Sets | BrickX"
- `src/app/sets/loading.tsx` — Skeleton page with 24 card placeholders

### Catalog Components (all in `src/components/catalog/`)

- `catalog-search.tsx` (client) — Debounced (300ms) search input, uncontrolled with key-based URL sync
- `catalog-sort.tsx` (client) — Select dropdown with 12 sort options (field + direction)
- `catalog-filters.tsx` (client) — Sidebar: theme checkboxes (top 20) in ScrollArea, year range inputs, status checkboxes with counts, MSRP price range inputs. All in Accordion. Clear all button.
- `mobile-filter-sheet.tsx` (client) — Sheet slide-from-left wrapping CatalogFilters, filter count badge
- `catalog-grid.tsx` — Responsive grid (`sm:grid-cols-2 lg:grid-cols-3`), empty state with Package icon + clear filters CTA
- `catalog-pagination.tsx` (client) — Pagination with ellipsis truncation, "Showing X–Y of Z sets" text
- `active-filters.tsx` (client) — Dismissible Badge pills for active filters above grid
- `set-card-skeleton.tsx` — Skeleton matching SetCard dimensions

### Modified Files

- `src/components/set-card.tsx` — Refactored from individual string props to `{ set: CatalogSet }`. Renders `img_url` via `next/image` with Package icon fallback. Handles nullable fields. Wrapped in `<Link href={/sets/${set.id}}>`.
- `src/lib/mock-data.ts` — Updated from `MockSet` to `CatalogSet` shape
- `src/components/landing/featured-sets-section.tsx` — Updated to new SetCard API, "Browse All Sets" links to `/sets`
- `src/components/site-header.tsx` — `#browse` → `/sets`
- `src/components/mobile-nav.tsx` — `#browse` → `/sets`
- `src/components/site-footer.tsx` — "Browse Sets" href → `/sets`
- `next.config.ts` — Added `images.remotePatterns` for `cdn.rebrickable.com/media/**`

**Verification:** `npx tsc --noEmit`, `npm test` (52 tests pass), `npm run lint`, `npm run format:check`

## Session 3C: Detail Page & Price Chart — **Complete**

**Goal:** Set detail page (`/sets/[id]`) with price chart, market stats, related sets, breadcrumb, and 404.
**Prerequisites:** 3A + 3B
**Deliverables:**

### Page & Loading

- `src/app/sets/layout.tsx` — Shared layout wrapping all `/sets/*` pages with SiteHeader + `<main>` + SiteFooter
- `src/app/sets/[id]/page.tsx` — Server component: fetches set detail, price history, related sets in parallel. Hero with image + info panel, market stats grid, Recharts price chart, related sets. `generateMetadata` for dynamic title/description.
- `src/app/sets/[id]/loading.tsx` — Skeleton page mirroring detail page structure
- `src/app/sets/[id]/not-found.tsx` — Set-specific 404 with Package icon, browse/home buttons. Inherits `/sets` layout.
- `src/app/not-found.tsx` — Global 404 with Blocks icon, own SiteHeader/SiteFooter

### Detail Components (all in `src/components/detail/`)

- `set-detail-breadcrumb.tsx` — Breadcrumb nav: Home > Browse Sets > {set name}. Uses shadcn breadcrumb + Next.js Link.
- `market-stats-grid.tsx` — 8 StatCard items in responsive grid (2/3/4 cols): Market Value New/Used, 7d/30d/90d change, Annual Growth, Investment Score, MSRP. N/A for null values, colored delta indicators.
- `price-chart.tsx` (client) — Recharts LineChart with two lines (new_avg, used_avg), custom tooltip, empty state card. XAxis as "MMM dd", YAxis as "$N".
- `related-sets.tsx` — Up to 6 SetCards in responsive grid (1/2/3 cols)

### Modified Files

- `src/app/sets/page.tsx` — Changed `<main>` to `<div>` to avoid nested `<main>` with layout
- `src/app/sets/loading.tsx` — Changed `<main>` to `<div>` to match
- `src/components/ui/breadcrumb.tsx` — Added via `npx shadcn@latest add breadcrumb`

**Verification:** `npx tsc --noEmit`, `npm test` (52 tests pass), `npm run lint`

## Session 4: Auth & Collection Management — **Complete**

**Goal:** Supabase Auth (email/password + OAuth), user collections with CRUD, portfolio value tracking, auth-reactive header.
**Prerequisites:** 2 + 3

### Phase 4A: Auth Infrastructure

- `supabase/migrations/013_auth_user_sync.sql` — INSERT policy on `users`, `handle_new_user()` trigger (SECURITY DEFINER) syncing `auth.users` → `public.users` with ON CONFLICT DO UPDATE
- `src/middleware.ts` — Supabase SSR middleware: cookie refresh on every request, matcher excludes static assets
- `src/app/auth/callback/route.ts` — OAuth/email code exchange, redirects to `next` param or `/`
- `src/app/(auth)/layout.tsx` — SiteHeader + centered content + SiteFooter
- `src/app/(auth)/sign-in/page.tsx` — Server shell + metadata
- `src/app/(auth)/sign-up/page.tsx` — Server shell + metadata
- `src/components/auth/sign-in-form.tsx` — Client component: email/password + Google/GitHub OAuth buttons, `?next=` redirect support
- `src/components/auth/sign-up-form.tsx` — Client component: email/password/name, confirmation message on success
- `src/lib/actions/auth.ts` — Server action: `signOut()` → redirect to `/`
- shadcn/ui components installed: `dropdown-menu`, `avatar`, `dialog`, `tabs`
- `next.config.ts` — Added `lh3.googleusercontent.com` + `avatars.githubusercontent.com` to `images.remotePatterns`
- `.env.example` — Added optional OAuth env var placeholders (Google/GitHub)

### Phase 4B: Collection CRUD

- `src/lib/types/collection.ts` — `CollectionSummary`, `CollectionItem`, `CollectionWithItems`, `PortfolioSummary`
- `src/lib/queries/collections.ts` — `fetchUserCollections()`, `fetchCollectionDetail()`, `fetchCollectionsContainingSet()`, `fetchPortfolioSummary()`
- `src/lib/queries/index.ts` — Updated barrel export with collection queries
- `src/lib/actions/collections.ts` — `createCollection`, `renameCollection`, `deleteCollection`, `addItemToCollection`, `updateCollectionItem`, `removeCollectionItem`
- `src/app/(app)/layout.tsx` — Auth-required layout: checks `getUser()`, redirects to `/sign-in` if not authenticated
- `src/app/(app)/collections/page.tsx` — Collections list with grid of cards + empty state
- `src/app/(app)/collections/loading.tsx` — Skeleton
- `src/app/(app)/collections/[id]/page.tsx` — Collection detail: breadcrumb, summary bar, items table, 404 handling
- `src/app/(app)/collections/[id]/loading.tsx` — Skeleton
- `src/components/collections/collection-card.tsx` — Name, item count, dropdown actions (rename/delete)
- `src/components/collections/create-collection-dialog.tsx` — Name input + create action
- `src/components/collections/rename-collection-dialog.tsx` — Pre-filled rename
- `src/components/collections/delete-collection-dialog.tsx` — Confirmation dialog
- `src/components/collections/collection-items-table.tsx` — Responsive table: image, set name, condition, purchase price, current value, gain/loss, actions
- `src/components/collections/edit-item-dialog.tsx` — Edit condition, price, date, notes
- `src/components/detail/add-to-collection-button.tsx` — "Sign in to collect" (logged out) or opens dialog (logged in)
- `src/components/detail/add-to-collection-dialog.tsx` — Collection picker, inline create, condition/price/date/notes fields
- `src/app/sets/[id]/page.tsx` — Modified: added auth check, AddToCollectionButton

### Phase 4C: Portfolio Dashboard & Header Integration

- `src/lib/supabase/auth.ts` — `getUser()` and `getUserProfile()` server-side helpers
- `src/components/auth/user-menu.tsx` — `UserMenu` (desktop dropdown) + `MobileUserMenu` (sheet items), reactive via `onAuthStateChange`
- `src/components/site-header.tsx` — Modified: replaced hardcoded auth buttons with `<UserMenu />`, nav links: Browse/Collections/Portfolio
- `src/components/mobile-nav.tsx` — Modified: replaced hardcoded buttons with `<MobileUserMenu />`, same nav links
- `src/components/site-footer.tsx` — Modified: Portfolio link → `/portfolio`
- `src/app/(app)/portfolio/page.tsx` — Summary cards + collection breakdown table, empty state with CTA
- `src/app/(app)/portfolio/loading.tsx` — Skeleton
- `src/components/portfolio/portfolio-summary-cards.tsx` — 4 StatCards: total value, cost basis, gain/loss, total sets
- `src/components/portfolio/collections-breakdown-table.tsx` — Per-collection table: name, items, value, cost, gain/loss %

**Verification:** `npx tsc --noEmit`, `npm run lint`, `npm run format:check` all pass

## Session 5: Market Intelligence, Alerts & SEO — **Complete**

**Goal:** Market intelligence pages, price alerts system, SEO infrastructure, and production polish.
**Prerequisites:** 4

### Phase 5A: Market Intelligence Pages

- `src/lib/queries/helpers.ts` — Extracted shared `SetRow` interface and `flattenSetRow()` from duplicated code in `sets.ts` and `set-detail.ts`
- `src/lib/queries/market.ts` — `fetchTrendingSets()` (7d/30d period toggle), `fetchRetiringSets()`, `fetchNewReleases()`, `fetchTopInvestments()` (optional price range filter)
- `src/lib/queries/sets.ts` — Refactored to import `SetRow`/`flattenSetRow` from helpers
- `src/lib/queries/set-detail.ts` — Same import refactor
- `src/lib/queries/index.ts` — Added market + alert query exports
- `src/components/market/market-hub-card.tsx` — Category card with icon, description, link
- `src/components/market/period-toggle.tsx` (client) — Tabs for 7d/30d trending period, updates URL
- `src/components/market/price-range-filter.tsx` (client) — Min/max MSRP inputs for top investments
- `src/components/market/investment-score-badge.tsx` — Color-coded 0-100 score display
- `src/components/market/market-pagination.tsx` (client) — Reusable pagination with configurable basePath
- `src/app/market/layout.tsx` — SiteHeader + main + SiteFooter (same pattern as sets)
- `src/app/market/page.tsx` — Hub page: 4 category cards + preview of top 6 trending sets
- `src/app/market/loading.tsx` — Hub skeleton
- `src/app/market/trending/page.tsx` — 7d/30d toggle, SetCard grid, pagination
- `src/app/market/trending/loading.tsx` — Trending skeleton
- `src/app/market/retiring/page.tsx` — Retired sets grid, pagination
- `src/app/market/retiring/loading.tsx` — Retiring skeleton
- `src/app/market/new-releases/page.tsx` — New sets grid (current year - 1), pagination
- `src/app/market/new-releases/loading.tsx` — New releases skeleton
- `src/app/market/top-investments/page.tsx` — Price range filter, SetCard grid, pagination
- `src/app/market/top-investments/loading.tsx` — Top investments skeleton
- `src/components/site-header.tsx` — Added "Market" nav link
- `src/components/mobile-nav.tsx` — Added "Market" nav link
- `src/components/site-footer.tsx` — Updated Trending link to `/market/trending`

### Phase 5B: Price Alerts System

- `supabase/migrations/014_create_price_alerts.sql` — `price_alerts` table with `alert_type` enum (price_drop/price_target/value_exceeded), `alert_status` enum (active/triggered/dismissed), indexes, RLS policies
- `supabase/migrations/015_create_notification_preferences.sql` — `notification_preferences` table (user_id PK, email/price_drop/value_exceeded toggles), RLS policies
- `src/lib/types/database.ts` — Added `AlertType`, `AlertStatus`, `price_alerts` and `notification_preferences` table types + enums
- `src/lib/types/alerts.ts` — `PriceAlert`, `NotificationPreferences` interfaces
- `src/lib/queries/alerts.ts` — `fetchUserAlerts()` (with status filter + set join), `fetchUnreadAlertCount()`, `fetchNotificationPreferences()`
- `src/lib/actions/alerts.ts` — `createPriceAlert`, `dismissAlert`, `markAlertRead`, `markAllAlertsRead`, `deleteAlert`, `updateNotificationPreferences`
- `src/components/alerts/notification-bell.tsx` (client) — Bell icon + unread badge count in header
- `src/components/alerts/alert-list.tsx` (client) — Alert cards with set info, status badge, read/dismiss/delete actions
- `src/components/alerts/create-alert-dialog.tsx` (client) — Dialog to create alert on a set (type selector, target price/threshold inputs)
- `src/components/alerts/notification-preferences-form.tsx` (client) — Toggle switches for email/price_drop/value_exceeded preferences
- `src/app/(app)/alerts/page.tsx` — Alert list with Active/Triggered/All tabs, mark all read button
- `src/app/(app)/alerts/loading.tsx` — Alerts skeleton
- `src/app/(app)/alerts/preferences/page.tsx` — Notification preferences form
- `src/components/site-header.tsx` — Added NotificationBell next to UserMenu
- `src/components/auth/user-menu.tsx` — Added "Alerts" dropdown item (desktop + mobile)
- `src/app/sets/[id]/page.tsx` — Added CreateAlertDialog button (auth-gated)
- `src/components/ui/switch.tsx` — Added via shadcn/ui

### Phase 5C: SEO & Production Polish

- `src/app/sitemap.ts` — Dynamic sitemap with all static pages + ~26K set detail pages (uses service role key)
- `src/app/robots.ts` — Allow all except `/api/`, `/collections/`, `/portfolio/`, `/alerts/`
- `src/components/json-ld.tsx` — Generic JSON-LD script injector component
- `src/app/layout.tsx` — Added WebSite JSON-LD with SearchAction schema
- `src/app/sets/[id]/page.tsx` — Added Product JSON-LD per set (name, SKU, brand, image, offers)
- `next.config.ts` — `poweredByHeader: false`, `compress: true`
- `src/app/api/health/route.ts` — Added `price_alerts` to monitored tables
- `src/app/(auth)/sign-in/page.tsx` — Fixed pre-existing build error: wrapped SignInForm in Suspense boundary

**Verification:** `npx tsc --noEmit`, `npm run lint`, `npm run format:check`, `npm run build` — all pass
