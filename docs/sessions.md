# BrickX — Session Tracker

## Session 1A: Project Setup & DB Schema — **Complete**

**Goal:** Initialize Next.js 15 project, create documentation, set up 12 database migrations, configure Supabase clients, deliver health check endpoint.
**Prerequisites:** None
**Deliverables:** Next.js project on port 5699, 12 SQL migrations, Supabase client/server/admin modules, `/api/health` endpoint, 5 docs files
**Verification:** `npm run dev`, `npx tsc --noEmit`, `npm run lint`, `npm run db:migrate`, `GET /api/health`

## Session 1B: Infrastructure & API Services — Pending

**Goal:** Build rate limiter, base API client with retry/backoff, and 4 API service modules for external data sources.
**Prerequisites:** 1A
**Deliverables:** `rate-limiter.ts`, `base-api-client.ts`, `rebrickable.ts`, `bricklink.ts`, `brickeconomy.ts`, `brickowl.ts`, `logger.ts`, `oauth1.ts`, `sleep.ts`, 5 type files
**Verification:** All type checks pass, unit tests for rate limiter and OAuth1 signing

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
