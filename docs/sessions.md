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

## Session 1C: Data Seeding & Aggregation — Pending

**Goal:** Download Rebrickable CSVs, seed 26K+ sets into DB, fetch prices from APIs, build price aggregation service, create cron-callable refresh script.
**Prerequisites:** 1A + 1B
**Deliverables:** `download-csvs.ts`, `seed-catalog.ts`, `seed-prices.ts`, `seed.ts`, `refresh-prices.ts`, `price-aggregator.ts`
**Verification:** `npm run db:migrate && tsx scripts/seed.ts` populates tables, price aggregation returns computed values

## Session 2: Design System & Landing Page — Pending

**Goal:** Build component library (colors, typography, cards, navigation) and a responsive landing page.
**Prerequisites:** 1A
**Deliverables:** Design tokens, UI components, landing page with hero, feature highlights, CTA
**Verification:** Visual review on mobile/desktop, Lighthouse accessibility score ≥90

## Session 3: Catalog, Search & Detail Pages — Pending

**Goal:** Browsable set catalog with search, filtering, sorting, and detailed set pages with pricing charts.
**Prerequisites:** 1C + 2
**Deliverables:** `/sets` catalog page, `/sets/[id]` detail page, search component, filter sidebar, price chart
**Verification:** Search returns results, filters work, set detail shows price history

## Session 4: Auth & Collection Management — Pending

**Goal:** Supabase Auth (Google/GitHub OAuth), user collections with CRUD, portfolio value tracking.
**Prerequisites:** 2 + 3
**Deliverables:** Auth flow, collection CRUD pages, portfolio dashboard, RLS enforcement
**Verification:** Login/logout works, collections persist, RLS blocks cross-user access

## Session 5: Market Intelligence & Deploy — Pending

**Goal:** Investment scoring, market trends, price alerts, and production deployment.
**Prerequisites:** 4
**Deliverables:** Investment score algorithm, trending sets page, price alert system, Vercel deployment, production Supabase
**Verification:** Deployed app accessible, scores computed, alerts trigger on threshold
