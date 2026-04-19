# BrickX — Two Roadmaps: UI/UX Overhaul + Functionality Buildout

## How to use this plan

**This document is the map. It is not executed in a single session.** Each numbered session (D1–D10, F1–F9) is a self-contained unit of work meant to run in its own fresh Claude Code session.

### Starting a session
1. Open a new Claude Code session in the worktree (or create a new worktree if you want isolation)
2. Prompt: `Execute Session {ID} from the plan at docs/roadmap.md` (e.g. "Execute Session D1…")
3. The session reads this plan, scopes itself to that session's deliverables only, builds, runs `npm run build`, and stops
4. Review, request tweaks or commit, then end the session

### Worktree preflight (agents: do this before any other work)
Claude Code spawns each session into its own git worktree under `.claude/worktrees/<name>/` on branch `claude/<name>`. Worktrees are isolated — they do NOT auto-inherit prior sessions' commits. Run this first:

```bash
pwd && git log --oneline -5 && ls .env.local 2>&1
```

1. **Prior session commits present?** If this session depends on a previous one (see Session sequencing table), confirm that commit is in `git log`. If missing, find it and merge forward:
   ```bash
   git branch -a
   git merge --ff-only claude/<branch-with-prior-work>
   ```
2. **`.env.local` present?** It's gitignored, so fresh worktrees are missing it and middleware crashes. `cp /Users/bentyson/brickx/.env.local .env.local` (or symlink).
3. **Dev server conflict?** Port 5699 can only host one Next.js dev. If the user reports `/demo/*` 404s, run `lsof -i :5699` — if it's pointing at the main repo or a different worktree, kill it and restart `npm run dev` from this worktree.

See `docs/session-start.md` § Worktree Preflight for the same procedure with more context.

### Session hygiene rules
- **One session = one plan entry.** Do not bundle D1+D2 in one session — context degrades.
- **Start each session fresh.** Do not resume a prior session's context window.
- **Commit at session end** following the existing conventional-commit style (`Session D1: design foundation — Geist, cobalt palette, motion primitives`).
- **Run `npm run build` before commit.** Global rule from CLAUDE.md.
- **Do not touch existing live routes during D1–D7.** All visual work lives under `/app/demo/*` until the D8 migration session.
- **Do not skip sessions out of order within a track** without re-reading the plan — dependencies exist (e.g. D6 assumes D1+D2 primitives; F2 is required before D6 has real chart data).

### Model selection (per session)

Each remaining session is annotated with a `**Model:**` line. Heuristic:
- **Opus 4.7** — flagship visual judgment, destructive cross-cutting refactors, prompt engineering, ambiguous architectural tradeoffs. Spend the tokens where quality drives the outcome.
- **Sonnet 4.6** — default for most sessions. Pattern-driven CRUD, infra setup, building from primitives that already exist, integrations with well-documented services.
- **Haiku 4.5** — not currently flagged for any session; reserve for purely mechanical follow-ups (single-file renames, copy-only edits, batch import sweeps).

Set with `/model opus` (or `sonnet` / `haiku`) at the start of the session — it's a per-session choice, not per-task. Don't switch mid-session unless the work has clearly entered a different mode (e.g. dropping from Opus to Sonnet for a mechanical migration tail after the design judgment is done).

The Model column in the sequencing table at the bottom is the source of truth.

### Sequencing (locked)
See the "Session sequencing" table at the bottom. Interleaves design (D) and functionality (F). Next session to run is **D1**.

### If a session's scope feels wrong
If mid-session Claude discovers the plan's scope for that session is wrong (missing dep, underestimated, scope creep needed), STOP and update this plan file first before continuing. The plan is the source of truth. Do not improvise.

### Session handoff (required at end of every session)
Before stopping, the agent MUST produce a handoff block with:
1. **Recommendation:** continue in this session, or start fresh? Honest read on remaining context quality + the upcoming session's size.
   - Default to "start fresh" for any upcoming session that touches 5+ new files or introduces a new architectural concept.
   - "Continue" is only appropriate when the next session is small, mechanical, or a direct extension of work already in context.
2. **Next session ID** per the sequencing table.
3. **Ready-to-paste prompt** for the next agent, in this exact format:
   ```
   Execute Session {NEXT_ID} from the plan at docs/roadmap.md
   ```
   Plus any session-specific flags the user should be aware of (e.g. "this session assumes D1 primitives are in place — verify `src/components/motion/` exists before starting").
4. **Open questions / tweaks requested** the user flagged but hasn't resolved — carry-forward for next session.

The user has final say — they may override the recommendation. But the agent must *make* a recommendation, not punt.

### Re-planning checkpoints
- After **D8** (migration): verify no live-route regressions, Lighthouse still green, before starting D9
- After **F5** (infra): soft launch readiness review — don't start F6+ until at least a few real users are on the platform
- After **F9**: stop and re-plan Phases C/D/E with real traction data — the marketplace phase especially should not be executed from the current plan without re-validation

---

## Context

BrickX V1 is skeleton-complete through Sessions 1–5: 26,095 sets seeded, auth + collections + portfolio + alerts UI + market intelligence + SEO all wired. Solid foundation. Two gaps prevent "wow":

1. **Visually functional, not stunning.** No Framer Motion, no sparklines, generic empty states, standard hero, no named indices, no monospace numerics, Inter (stock) typography, OKLCH tokens exist but aren't pushed into a distinct brand voice. Competitors (BrickVault, BrickEconomy, BrickLink) are all dated or plain — this is where we win or lose.
2. **Functionally thin in key places.** Email delivery is stubbed. Zero admin tooling. No historical portfolio snapshots. No bulk import/export. No onboarding. No production infra (Sentry, analytics, rate limiting). No marketplace (Phase 2 of business). No AI (Phase 3).

The user wants two parallel tracks of multi-session work, each session sized to fit a single context window with room for iteration (~4–8h of focused build).

**Design strategy decided:** Build the UI overhaul in a `/demo/*` route namespace first — unwired, mock data, zero risk to working app. Iterate there until it's right, then migrate polished components back into the live pages. This lets us move fast visually and avoid the "redesign breaks production" anti-pattern.

---

## Audit Findings (from explore agents)

### What's working
- **Data layer:** 15 migrations, RLS policies, 26,095 sets, BrickLink/BrickEconomy/BrickOwl/Rebrickable services fully wired with token-bucket rate limiting, weighted price aggregation (0.50/0.30/0.20), investment score algorithm
- **App shell:** Next.js 15, sticky header, mobile sheet nav, footer, 15 routes, 404s, JSON-LD, sitemap (26K URLs), robots.txt, Open Graph
- **Auth:** Supabase email/password + Google + GitHub OAuth, middleware session refresh, protected `(app)` layout, RLS-enforced server actions
- **Features:** Catalog with filters/sort, set detail with Recharts price history, market intel (trending/retiring/new/top-investments), alerts CRUD + preferences UI, portfolio summary with gain/loss, collections CRUD with condition/purchase_price/notes

### What's missing or stubbed
- Email delivery (UI says "coming soon")
- Historical portfolio snapshots (only current state)
- Bulk CSV import/export for collections
- Admin/superadmin anything — no role, no panel, no curation, no user management
- Onboarding flow (new user lands on empty dashboard)
- Framer Motion (package.json confirms absent)
- Sparklines, allocation pies, treemaps, named indices
- Command palette (cmd+K)
- Public/shared portfolios
- Production infra (Sentry, PostHog, Railway config, CSP, API rate limiting)
- Component tests (52 unit tests only, no Playwright/E2E)
- eBay active listings
- News/retirement announcements feed
- Marketplace (Phase 2)
- AI tools (Phase 3)

### Critical files to know
- [src/app/globals.css](src/app/globals.css) — OKLCH tokens, dark-first
- [src/components/sets/set-card.tsx](src/components/sets/set-card.tsx) — flagship card
- [src/components/sets/price-chart.tsx](src/components/sets/price-chart.tsx) — Recharts line
- [src/components/landing/hero-section.tsx](src/components/landing/hero-section.tsx) — 108 lines
- [src/app/(app)/portfolio/page.tsx](src/app/(app)/portfolio/page.tsx)
- [src/app/sets/[id]/page.tsx](src/app/sets/[id]/page.tsx) — best page
- [src/lib/services/price-aggregator.ts](src/lib/services/price-aggregator.ts) — scoring logic
- [src/components/alerts/notification-preferences-form.tsx](src/components/alerts/notification-preferences-form.tsx) — email stub
- [src/lib/queries/collections.ts](src/lib/queries/collections.ts) — fetchPortfolioSummary
- [supabase/migrations/](supabase/migrations/) — 15 migrations
- [scripts/refresh-prices.ts](scripts/refresh-prices.ts) — cron-callable refresh

---

# ROADMAP 1 — UI/UX Overhaul

**North-star aesthetic:** Editorial-financial. Think Robinhood Markets × Stripe Press × FT Weekend with data-density of StockX, not trading-app chrome. Warm-black surfaces, electric ultramarine accent used sparingly, Instrument Serif for hero/editorial moments, Geist Sans for UI, Geist Mono + tabular for every figure, green/red as the only semantic signal (gains/losses), bento grids, gradient area charts, sparklines-in-rows, oversized hero metrics, named indices as hero product ("BrickX 100", "Star Wars Heat Index"), Framer Motion used sparingly.

**Brand color system (revised D1 — "restraint is the luxury"):**
- Accent: `#4C6FFF` (electric ultramarine — specified, not the ubiquitous Tailwind-500 cobalt). CTAs, active state, chart primary series, brand moments only.
- Accent hover: `#6C88FF`
- Accent pressed: `#3A5CE8`
- Success/gain: `#22C55E` (green)
- Danger/loss: `#EF4444` (red)
- Warning: `#F59E0B` (retiring soon)
- Info: `#8B5CF6` (special/exclusive badges only — used sparingly)
- Backgrounds (warm-black elevation triad): `#0B0A0C` → `#161418` → `#1E1B22` (microscopic violet-red undertone reads as leather/paper, not Chrome)
- Borders (hairline only, used sparingly): `rgba(255,255,255,0.05)` thin / `rgba(255,255,255,0.09)` emphasis — lean on whitespace, not borders, for grouping

**Typography system (D1 v2):**
- Display/editorial: **Instrument Serif** (400 + italic) — hero headlines, pull-quotes, section leads. The single biggest lever separating BrickX from generic fintech SaaS.
- UI/body: Geist Sans
- Numerics: Geist Mono + `.font-tabular` (tabular lining figures, on for every price, delta, percent)

**Execution model:** Every session builds inside `/app/demo/*`. No existing pages touched until Session D8 (migration). Mock data lives in `/lib/mock/`. When a demo page is approved, its components replace the live equivalents in one migration PR.

## Session D1 — Foundation: tokens, type, motion primitives
**Goal:** New design system substrate. Zero new pages, rebuild of primitives.

- Swap Inter → **Geist Sans + Geist Mono** via the `geist` npm package, and add **Instrument Serif** via `next/font/google` for editorial display
- Rewrite `globals.css` palette: warm-black elevation triad `#0B0A0C` → `#161418` → `#1E1B22`; electric ultramarine accent `#4C6FFF`; 4-tier text opacity (100/72/48/28%); hairline borders `rgba(255,255,255,0.05)` / emphasis `rgba(255,255,255,0.09)`; `.font-serif-display` utility for editorial headlines
- Typography scale: display (96–120px), h1 (56), h2 (40), h3 (28), body (15), small (13), micro (11); tabular lining figures ON for numerics class (`.font-tabular`)
- Motion primitives: install `framer-motion`, create `<FadeIn>`, `<SlideUp>`, `<CountUp>`, `<StaggerChildren>`, `<ScrollReveal>` wrappers in `src/components/motion/`
- Noise texture utility (SVG filter) + radial/conic gradient utilities
- `/app/demo/tokens/page.tsx` — visual token gallery (colors, type, elevation, motion demos)

**Files:** `globals.css`, `tailwind.config.ts`, `src/components/motion/*`, `src/app/demo/tokens/page.tsx`

## Session D2 — Core primitives rebuilt
**Goal:** Redesigned shared components living in demo namespace.

- `<StatCard>` v2 — count-up value, 90-day sparkline in card body, delta chip, hover tooltip with 1M/3M/1Y toggles
- `<SetCard>` v2 — premium hover (scale 1.02 + elevation + border glow), sparkline strip under image, status badge as small pill, MSRP→current with animated arrow
- `<Sparkline>` primitive — Recharts Area with gradient fill (stop-opacity 0.4 → 0), monotone bezier, no axes, ~70×20
- `<PriceChart>` v2 — gradient area fill, crosshair tooltip with tabular numerics, 1M/3M/6M/1Y/ALL/Custom range chips, event overlays (retirement, re-release)
- `<DataTable>` v2 — no zebra, thin borders only, sticky header, sparkline column, monospace numerics, row hover glow, skeleton pulse loading
- `<BidAskPair>` — StockX-style dual display for set detail
- `<Index>` badge component for BrickX 100 / theme indices
- `<CommandPalette>` primitive (cmd+K) — fuzzy search sets, themes, recent
- `/app/demo/components/page.tsx` — kitchen-sink preview of every primitive

**Files:** `src/components/ui/*` (new variants alongside existing), `src/components/charts/*`, `src/app/demo/components/page.tsx`

## Session D3 — Landing page redo
**Goal:** `/demo/landing` — marketing page that feels like a fintech IPO prospectus.

- Hero with oversized metric: "LEGO has returned **~11% annually** since 2000" at 120px Geist, noise texture over radial gradient, animated live ticker bar ("Millennium Falcon +2.3% today")
- Sub-hero: twin CTAs + animated portfolio mockup (count-up values, rotating charts)
- Bento grid "Why BrickX": 2 large + 3 small modular cards, one cell is a live activity ticker ("+47 sets tracked in last hour")
- Named-index showcase — "BrickX 100" card with live-updating sparkline
- Featured sets carousel (not static grid) with sparklines on each card
- Competitor comparison table (BrickX vs BrickEconomy vs BrickVault vs spreadsheet) — checkmark heavy
- Social proof strip (press logos if any, or "26,000+ sets, $X tracked, Y collectors" counter)
- Testimonial cards (3-col, real or placeholder)
- Final CTA with serif pull-quote: "LEGO as an asset class."
- Reworked footer (legal, social, sitemap hints)

**Files:** `src/app/demo/landing/page.tsx`, `src/components/landing-v2/*`

## Session D4 — Catalog + Search (cmd+K) + Theme pages
**Goal:** `/demo/sets`, `/demo/themes` — browse experience that shames BrickEconomy.

- Filter rail: pill chips for status, theme checklist with search, dual-thumb range sliders for year/price/parts, active-filter bar with "Clear all"
- Results grid with view toggle (grid/list), list view has sparkline column and multi-sort
- URL-driven state (shareable filters)
- Command palette triggered cmd+K — fuzzy across sets/themes/minifigs with images in results
- Theme hub: grid of theme cards each with mini-stats (sets count, avg appreciation, hero set image), top themes pinned
- Theme detail: theme-level index chart, sets table with sparklines
- Skeleton loading with pulse on data fetch
- Empty state with illustration (not just icon)

**Files:** `src/app/demo/sets/*`, `src/app/demo/themes/*`, `src/components/catalog-v2/*`

## Session D5 — Set detail (flagship) redo
**Goal:** `/demo/sets/[id]` — the make-or-break page.

- Hero image treatment: large centered, parallax tilt on hover, lightbox on click with multi-angle swiper
- Left column: image + thumbnails + image metadata; right column: name/ID/theme/year at top, oversized current market value with count-up, delta chip, bid/ask pair, BrickX index membership badges
- "Key stats" strip (StockX-style): last sale, 30d high/low, volume (qty sold), volatility
- Interactive price chart full-width below fold: range chips, series toggle (new/used/BrickLink/BrickOwl/BrickEconomy), event annotations (retirement, re-release), crosshair tooltip
- "Fundamentals" section: MSRP, parts, minifigs, piece-price, CAGR, projected retirement
- "How we calculate market value" disclosure accordion (build trust)
- Related sets: carousel with sparklines
- "Sets that moved together" correlation section
- Add to collection / create alert as sticky right-rail on desktop, bottom sheet on mobile
- Share to social with auto-generated OG image

**Files:** `src/app/demo/sets/[id]/page.tsx`, `src/components/set-detail-v2/*`

## Session D6 — Portfolio + Collections dashboard
**Model:** Opus 4.7 — flagship dashboard; dense composition (donut + treemap + attribution + holdings) where visual judgment dominates and the page sets the pattern for D7.
**Goal:** `/demo/portfolio`, `/demo/collections/[id]` — Robinhood-grade.

- Portfolio hero: huge total value with count-up, delta today/7d/30d/all chips, full-width gradient area chart of historical portfolio value (mocked)
- Allocation donut chart (by theme), treemap (by set value), risk/return scatter
- Top movers table (sparklines, sortable)
- Performance attribution ("Star Wars drove +$847 this month")
- Holdings table: image thumb, name, qty, cost basis, current, gain $, gain %, 30d sparkline, sort/filter
- Time-range toggle that animates chart + stats together
- Collection detail: same language, scoped to one collection
- Wishlist view: current prices, target lines on mini-charts, "deal detected" badges
- Empty portfolio: illustrated onboarding prompt ("Add your first set" CTA)

**Files:** `src/app/demo/portfolio/page.tsx`, `src/components/portfolio-v2/*`

## Session D7 — Market intelligence + Named indices
**Model:** Sonnet 4.6 — extends D6 dashboard primitives across multiple market pages; composition over invention once the pattern exists.
**Goal:** `/demo/market/*` — the differentiator. Indices as a product.

- `/demo/market` hub: hero with BrickX 100 live chart, featured indices grid (Star Wars Heat Index, Modulars Index, Retired Gold, Ideas Index), biggest movers strip
- `/demo/market/indices/[slug]` — each index has its own page with constituents table, methodology disclosure, historical chart, rebalance notes
- Trending: 7d/30d/90d toggle, gainers/losers split, sparklines, volume
- Retiring Soon: countdown chips, risk score, historical retirement appreciation reference
- New Releases: card grid with "first 30 days" mini-chart
- News feed stub (LEGO announcements, retirements, re-releases) — placeholder data
- Heatmap visualization for "theme of the month"

**Files:** `src/app/demo/market/*`, `src/components/market-v2/*`, `src/lib/mock/indices.ts`

## Session D8a — Motion pass across /demo/*
**Model:** Opus 4.7 — motion taste and consistency across 17 demo routes; set the cadence that D8b will carry into live routes.
**Goal:** Apply the motion layer to every /demo/* page so the demos feel shipped. No live-route changes. Zero migration risk.

- Page transitions (native View Transitions API with Framer Motion fallback) at the demo layout level
- Stagger entrance for lists/grids on viewport entry (apply existing `<StaggerChildren>` across demo tables, grids, carousels)
- Count-up for every numeric stat card on mount (wire existing `<CountUp>` into portfolio/market stat components)
- Chart reveal animation (path draw) — gradient area charts and sparklines
- Toast slide-in with spring physics (new `<Toast>` primitive if not present)
- Button press feedback (scale 0.98) — utility applied to primary buttons
- Skeleton → content crossfade via `AnimatePresence`
- Navigation link underline slide (layout primitive, demo header)
- Reduced-motion (`prefers-reduced-motion`) respected throughout

**Files:** `src/components/motion/*` (new page-transition + toast + button primitives), wiring across `src/components/*-v2/*` and `src/app/demo/*`.

## Session D8b — Migration to production (split into D8b-1/2/3)

**Split rationale (recorded mid-D8b-1):** The audit revealed that v2 components consume mock data shapes, not live DB shapes; hardcoded `/demo/` hrefs are scattered through v2 code; and catalog-v2 is client-side while legacy catalog is server-rendered. Six families × real-data rewiring × per-family smoke tests is not one session. Split into three smaller, shippable sessions:

### Session D8b-1 — Landing migration + showcase cleanup
**Model:** Opus 4.7 — low real-data risk (landing uses mocks in both versions for ticker/featured) but still the first live-route swap; sets the pattern for D8b-2/3.
**Goal:** Replace live home page with v2 landing; delete pure showcase demo routes.

- Migrate `src/app/page.tsx` to use `landing-v2/*` components; preserve skip-to-content link
- Rename `src/components/landing-v2/` → `src/components/landing/` (delete legacy landing first)
- Decide: keep `src/lib/mock/series.ts` + landing mock data co-located with page, or extract. Landing is inherently marketing-mocked; OK to keep.
- Delete `src/app/demo/landing/`, `src/app/demo/tokens/`, `src/app/demo/components/` (pure showcase — no live equivalent to migrate)
- Audit `/demo/*` links in live code (site-header, site-footer, nav, CTAs); fix any that leaked in
- `npm run build` green; smoke test `/` renders

### Session D8b-2 — Catalog + Set detail migration
**Model:** Opus 4.7 — highest-complexity pair. Catalog v2 is client-side vs legacy server-rendered (architectural decision needed). Set detail v2 has richer components but mock-only data flow (must rewire to real queries).
**Goal:** Migrate `/sets`, `/themes`, `/sets/[id]` to v2 visuals while preserving server-rendered data fetching and real feature wiring (add-to-collection, alerts).

- **Catalog:** decide paradigm — adopt v2 visuals into existing server-rendered flow (recommended) vs switch to client-side v2 (loses URL-synced filters + SSR SEO). Recommended: port v2 filter rail / list view / theme cards into legacy server-rendered catalog.
- **Set detail:** rewire v2 components to accept real set + price data shapes. Replace hardcoded `/demo/sets/X` hrefs with dynamic `/sets/[id]`. Preserve add-to-collection, alert creation, breadcrumb logic.
- Rename `catalog-v2/` → `catalog/`, `set-detail-v2/` → `detail/` (or canonical names) after legacy deleted
- Delete `/demo/sets/*`, `/demo/themes/*`
- `npm run build` + smoke test: filter, sort, open set, add to collection, create alert

### Session D8b-3 — Portfolio + Market migration (keep /app/demo/ as workbench)
**Model:** Opus 4.7 — auth-gated, data-heavy. Portfolio v2 is a full redesign consuming mock holdings/indices; must wire to `fetchPortfolioSummary` + `fetchPortfolioHistory` (F2).
**Goal:** Migrate `/portfolio`, `/collections/[id]`, `/market/*` to v2 while preserving `/app/demo/*` as a living reference.

**Scope note (decided post-D8b-2):** `/app/demo/*` is preserved indefinitely as the v2 design-system workbench — don't delete it. This is a deliberate choice to keep a mock-data showcase available for iterating on new surfaces.

- **Portfolio:** wire v2 hero/holdings-table/allocation-donut/treemap/top-movers to real collections data. Empty-portfolio component becomes real onboarding nudge. Hardcoded `/demo/sets/…` hrefs need a per-context `hrefPrefix` prop (pattern already used in `holdings-table.tsx`) so live pages pass `/sets/` and demo pages keep passing `/demo/sets/`.
- **Market:** wire v2 index-hero, trending/retiring/new-releases tables to real market queries. News feed stays mocked (deferred to Phase C).
- **Collections detail:** apply v2 language (v2 has no separate collection-detail; reuse portfolio primitives scoped to one collection).
- **Wishlist:** embedded in portfolio-v2; port alongside.
- **Do NOT rename** `portfolio-v2/` / `market-v2/` / `mock/*` — demo pages still import them. Live routes import from `-v2/` directly. (Alternative: duplicate needed components into canonical `portfolio/` and `market/` and leave `-v2/` for demo only. Either works; pick the cheaper one.)
- **Do NOT delete** `src/app/demo/*` or `src/lib/mock/*`. Keep `src/app/demo/layout.tsx`, mock data, and the -v2 components backing the demo pages intact.
- `npm run build` + Lighthouse on migrated live pages; smoke test both a live flow and a `/demo/*` page to verify the demo workbench still renders.

**Files across D8b-1/2/3:** D8b-1 deleted legacy landing + `/demo/{tokens,components,landing}`. D8b-2 deleted legacy catalog/detail and renamed catalog-v2/set-detail-v2 → canonical; also deleted `/demo/sets` and `/demo/themes`. D8b-3 stops there — remaining `/demo/*` routes (portfolio, market, collections, wishlist) stay as the workbench.

## Session D9 — Mobile polish + auth pages + empty/loading states + a11y
**Model:** Sonnet 4.6 — many small surfaces (mobile nav, auth pages, empty states, skeletons, a11y fixes); pattern-driven once D2 primitives are reused.
**Goal:** Every surface polished, not just desktop happy-path.

- Mobile bottom tab nav with blur backdrop + active state animation
- Bottom sheet replaces modals on mobile for Add-to-Collection / Create Alert
- Pull-to-refresh on portfolio (where useful)
- Auth pages (sign-in, sign-up, forgot password, verify-email, callback) redesigned as split-screen with feature showcase on one side
- Onboarding flow scaffold (welcome, add first set, import later CTA) — UI only; functional wiring lives in Functionality Roadmap F3
- Custom SVG illustrations (not Lucide icons) for empty states: empty portfolio, no search results, no alerts, no collections
- Skeleton pulse animations everywhere data loads
- Accessibility audit: focus rings, aria labels, keyboard nav for command palette and modals, color contrast AAA for text, screen-reader labels on charts
- Lighthouse target: 95+ across the board

**Files:** `src/app/auth/*`, mobile components, a11y fixes in primitives

## Session D10 — Brand voice, copy pass, OG images, polish sweep
**Model:** Opus 4.7 — copywriting voice across every headline / CTA / empty state demands taste; OG generation + favicons are mechanical but secondary to the prose pass.
**Goal:** Final polish, copywriting, and launch-readiness visuals.

- Copywriting pass: every headline, CTA, empty state, tooltip, error message rewritten in a distinctive brand voice (confident, data-literate, a little irreverent — "LEGO as an asset class" register, not "Welcome to our awesome platform")
- Open Graph image generation route (`@vercel/og`) — dynamic per-set OG image with set image + current value + delta on brand-styled background
- Favicon set, app icon, PWA manifest
- 404 and 500 pages redesigned with brand personality
- Dark / light mode final pass (light mode currently untested — either polish to parity or remove the toggle)
- Final walkthrough: record a video of every user flow to catch missed details
- Design handoff doc: `docs/design-system.md` with token reference, component inventory, motion rules, do/don't examples

**Files:** `src/app/opengraph-image.tsx`, `src/app/not-found.tsx`, copy across components, `docs/design-system.md`

---

# ROADMAP 2 — Functionality Buildout

**Scoped to Phase A (launch-readiness) + Phase B (growth). 9 sessions total.** Phases C/D/E (data expansion, marketplace, AI supply) are deferred — they depend on real traction signals and will be re-planned after Phase B ships.

## Phase A — Launch-readiness (close the V1 gaps)

### Session F1 — Notification engine (email + triggers)
**Why:** Alerts UI exists but never fires. This is the first "aha" — user sets a price target at 3am, wakes up to an email.

- Install `resend` + create `src/lib/email/` with client + typed send wrappers
- React Email templates: `PriceDropAlert`, `ValueExceededAlert`, `WishlistAvailable`, `WeeklyDigest`
- Cron endpoint `/api/cron/evaluate-alerts` — runs every 15 min, queries `price_alerts` joined to latest `set_market_values`, triggers matching alerts, updates status, inserts in-app notification row, enqueues email
- Deliverability: SPF/DKIM setup docs, from-address config, unsubscribe footer with token
- Rate limiting per user (max N emails/hour)
- Weekly digest job (Monday 8am) — portfolio summary email for users who opted in
- Tests: alert matching logic, email render snapshots
- Wire the "coming soon" stub in [notification-preferences-form.tsx](src/components/alerts/notification-preferences-form.tsx) to real

**Env:** `RESEND_API_KEY`, `EMAIL_FROM`, `CRON_SECRET`

### Session F2 — Historical portfolio snapshots + advanced analytics
**Why:** "Portfolio value over time" is fundamental to an investment tracker. Currently only showing current state.

- Migration: `portfolio_snapshots(user_id, snapshot_date, total_value, cost_basis, item_count, by_theme_json, by_condition_json)` with unique(user_id, snapshot_date)
- Cron endpoint `/api/cron/snapshot-portfolios` — runs 00:05 daily, computes + upserts one row per user with any items
- Backfill script using existing `set_prices` history for first snapshot
- Query `fetchPortfolioHistory(userId, range)` with 1W/1M/3M/1Y/ALL
- API: `/api/portfolio/history` (auth required) for chart
- UI hookup: portfolio page historical chart becomes real (replaces mock from D6)
- Performance attribution query: per-theme gain by period
- Top movers in collection query

### Session F3 — Onboarding + Bulk import/export
**Model:** Sonnet 4.6 — moderate scope; CSV parser + onboarding flow follow established UI patterns.
**Why:** First-run experience is "empty dashboard, good luck." Biggest conversion/retention lever.

- Onboarding route `/onboarding` with 3-step flow (welcome → import or add manually → set alert preferences)
- Trigger on first sign-in (check `users.onboarded_at` null)
- CSV import: drag-drop upload, column mapper, dry-run preview with error rows, confirm & commit, result summary. Match by set_id or set_num. Support BrickLink XML export format too (common user ask)
- CSV export: per-collection or all-collections. Columns: set_num, name, theme, condition, purchase_date, purchase_price, current_value, gain_loss, notes
- JSON export: same data
- Import history table (audit trail)
- UI: `Import from CSV` button on collection detail; `Export` dropdown (CSV/JSON)
- "Import from Brickset account" stub (document as F4 future work)

### Session F4 — Admin / Superadmin console
**Model:** Sonnet 4.6 — full-stack scaffolding (migration + RLS + 6 admin pages + audit log); volume of well-templated work, not novelty.
**Why:** You have zero ops surface. Today you SSH Supabase SQL editor. This is untenable at scale.

- Schema: add `users.role` enum (`user`, `admin`, `superadmin`) with default `user`; seed your account as superadmin. RLS policy bypass for admin reads.
- Middleware: gate `/admin/*` behind admin role
- `/admin/dashboard` — platform KPIs (DAU, MAU, signups, collections created, alerts fired, portfolio TVL, top themes)
- `/admin/users` — list with search, detail view, impersonation toggle (super-admin only), soft delete, force password reset
- `/admin/sets` — search, edit set (override msrp, force status, mark hidden, flag), view price sources side-by-side, manual price override
- `/admin/data-pipeline` — last seed run, last price refresh, API health per service, rate-limit utilization, trigger-refresh button
- `/admin/alerts` — alert volume, delivery status, failed emails, retry controls
- `/admin/feature-flags` — simple key/value table with boolean/string values, `useFlag(key)` hook for gated features
- Audit log table for admin actions
- Tests: role middleware, policy enforcement

### Session F5 — Production infrastructure
**Model:** Sonnet 4.6 — standard infra setup (Sentry, PostHog, Upstash, CSP, CI, Playwright) following well-documented vendor flows.
**Why:** No Sentry, no analytics, no rate limiting, no CSP, no CI. Can't launch safely.

- Deploy target: decide Vercel vs Railway (recommend Vercel for Next.js 15 + Supabase; Railway still fine). Write `vercel.json` or Railway config.
- Sentry: `@sentry/nextjs`, error boundary, source maps, release tagging
- Analytics: PostHog (privacy-respecting, funnels, feature flags overlap with F4)
- Rate limiting: Upstash Redis + middleware for `/api/*` routes (IP + user tiers)
- Security headers: CSP, HSTS, X-Frame-Options, referrer policy via `next.config.ts` headers
- CORS: locked to known origins
- GitHub Actions: lint + typecheck + test on PR; preview deploys on Vercel
- Playwright E2E suite: critical path (sign-up → add set → see portfolio)
- Error monitoring dashboards, uptime (BetterStack or similar)
- `.env.production.example`, secrets rotation doc
- Cron job orchestration: Vercel Cron or QStash for F1/F2 jobs

## Phase B — Growth features

### Session F6 — Discovery 2.0
**Model:** Sonnet 4.6 — search/typeahead/compare are well-known patterns built atop existing primitives (cmd+K shell + Postgres tsvector).
**Why:** Differentiate from BrickEconomy with a world-class search/compare surface.

- Command palette live (from D2) wired to real search
- Postgres full-text search indexes on sets (tsvector), themes, minifigs
- Typeahead API `/api/search/instant` with Redis cache
- Saved searches: user can save a filter state with a name, access from sidebar
- Shareable filter URLs (already in D4)
- Advanced filters panel: parts range, minifig range, theme tree (parent + children), release year range, retirement status, price tier
- "Compare sets" feature: up to 4 sets side-by-side with stat grid + overlaid price charts
- Similar sets: collaborative-filtering stub using shared collections as signal + theme/piece-count similarity
- Recently viewed (localStorage)

### Session F7 — Public portfolios + social foundations
**Model:** Sonnet 4.6 — schema additions + public profile route + follow graph + activity feed; standard plumbing throughout.
**Why:** Collectors love to flex. Public portfolios are viral loops.

- `users.is_public_profile`, `users.slug` columns
- `/u/[slug]` public page: chosen collections (user selects which are public), portfolio summary if opted in, avatar, bio, joined date, social links
- Privacy controls: per-collection is_public flag, hide-exact-purchase-prices option
- Follow graph: `user_follows(follower_id, followed_id)` table
- Activity feed: `user_activity` append-only table (added set, hit alert, created collection, reached milestone), follower feed on home for signed-in users
- Leaderboards (opt-in): top portfolios by value, by gain %, by diversity, weekly/monthly
- OG image generator for public profiles (reuse D10 infra)
- Anti-abuse: report button, flagged content queue in admin (F4)

### Session F8 — Community + Engagement
**Model:** Sonnet 4.6 — reviews + threaded comments + moderation; CRUD with established patterns and F4 admin reuse.
**Why:** Reviews/comments convert a catalog into a community.

- Set reviews: `set_reviews(user_id, set_id, rating, title, body, verified_owner_flag)` with aggregate stars on set detail
- Set comments threaded: `set_comments(parent_id, user_id, set_id, body)`
- Moderation: report, hide, admin resolve (F4 integration)
- User notification when someone replies to their comment
- Set of the Day / Week featured on homepage (admin-curated via F4)
- User "watchlist" separate from wishlist — lightweight follow-without-buy-intent for price-watching

### Session F9 — AI-powered insights
**Model:** Opus 4.7 — prompt design + NL-to-filter parsing + anomaly detection; the work *is* AI judgment, exactly Opus' strength.
**Why:** Claude API enables portfolio analysis that BrickVault/BrickEconomy can't touch.

- `/api/insights/portfolio` server route calling Claude Sonnet with portfolio data, returns markdown-rendered insight card
- "Your portfolio this week" narrative: generated Monday, cached for user
- Set-level AI analyst note on set detail pages: "Why this set is interesting" using market data + retirement context
- Natural-language search: "retired modular buildings under $500 with high appreciation" → parsed to filter state
- Anomaly detection: flag unusual price jumps with explanations
- Budget: token caps per user, prompt caching for common flows
- Model: Claude Sonnet 4.6 default; Haiku for cheap flows

## Deferred (future phases — out of current scope)

**Phase C — Data expansion** (to be planned after Phase B ships)
- eBay active listings integration
- News + announcements feed (LEGO retirements, releases)
- BrickX named indices as first-class product (BrickX 100, Heat Indices with real compute jobs)

**Phase D — Marketplace (Business Phase 2)** (re-plan after traction signals)
- Seller onboarding + KYC
- Listings (fixed price, auction, bid/ask)
- Stripe Connect payments + escrow
- Fulfillment, shipping labels, reviews, disputes

**Phase E — AI Supply Tools (Business Phase 3)**
- AI set identification from photos
- AI pricing + listing assistant

---

## Verification plan

### UI Overhaul (per-session)
- Build every demo page mobile-first, verify at 375 / 768 / 1280 / 1920 breakpoints
- Lighthouse per page: target 95+ performance, 100 a11y, 100 best-practices, 100 SEO
- Chromatic or Storybook snapshot for primitives (optional but strongly recommended from D2)
- Record a video per session; post to review doc
- **D8b migration gate:** `npm run build` green, no console errors, spot-check all live routes
- **D10 launch gate:** full E2E walk-through on real iPhone + real desktop; friend/user test with 3 external people

### Functionality (per-session)
- Every server action covered by integration test
- RLS policy tests for new tables
- `npm run build` + `npm test` green before commit
- Per-session: manual end-to-end of the new flow
- **Phase A exit:** can sign up → import CSV → add sets → receive email when price alert fires → see historical chart updating daily → superadmin can see it all from /admin
- **Phase B exit:** public portfolio page shareable, AI insight renders, activity feed populates
- **Phase C exit:** eBay listings show on set detail, BrickX 100 has live daily values
- **Phase D exit:** complete a test transaction end-to-end in sandbox
- **Phase E exit:** upload pile-of-bricks photo, get candidate set IDs

---

## Session sequencing (locked: interleaved)

Design and functionality alternate so neither track blocks the other. Total: **19 sessions to public launch + growth features.**

| # | Session | Track | Model | Rationale |
|---|---------|-------|-------|-----------|
| 1 | **D1** — Foundation: tokens, type, motion | Design | — (done) | Unblocks every subsequent visual session |
| 2 | **F1** — Notification engine | Func | — (done) | Closes highest-visibility V1 stub (email alerts) |
| 3 | **D2** — Core primitives rebuilt | Design | — (done) | Reusable across all later design sessions |
| 4 | **D3** — Landing page redo | Design | — (done) | Flashy early win; marketing surface |
| 5 | **F2** — Historical portfolio snapshots | Func | — (done) | Needed before D6 to feed real historical charts |
| 6 | **D4** — Catalog + Search + cmd+K | Design | — (done) | Core browse experience |
| 7 | **D5** — Set detail (flagship) redo | Design | — (done) | The page that sells the product |
| 8 | **F3** — Onboarding + bulk CSV import/export | Func | — (done) | Biggest retention lever |
| 9 | **D6** — Portfolio + Collections dashboard | Design | Opus 4.7 | Now backed by real F2 data |
| 10 | **D7** — Market intelligence + named indices | Design | Sonnet 4.6 | Differentiator pages |
| 11 | **F4** — Admin / Superadmin console | Func | Sonnet 4.6 | Required before wider launch for ops |
| 12 | **D8a** — Motion pass across /demo/* | Design | Opus 4.7 | Make demos feel shipped; no live-route risk |
| 13a | **D8b-1** — Landing migration + showcase cleanup | Design | Opus 4.7 | First live-route swap; sets pattern for rest |
| 13b | **D8b-2** — Catalog + Set detail migration | Design | Opus 4.7 | Highest-complexity pair; real-data rewiring |
| 13c | **D8b-3** — Portfolio + Market migration (keep /demo workbench) | Design | Opus 4.7 | Auth-gated data-heavy; preserves `/app/demo/*` as v2 reference |
| 14 | **D9** — Mobile + auth + empty/loading + a11y | Design | Sonnet 4.6 | Every surface polished |
| 15 | **D10** — Brand voice + OG images + final polish | Design | Opus 4.7 | Launch-readiness visuals |
| 16 | **F5** — Production infrastructure | Func | Sonnet 4.6 | Sentry, PostHog, rate limiting, CSP, CI, deploy |
| — | **🚀 Public soft launch** | — | — | After F5 |
| 17 | **F6** — Discovery 2.0 | Func | Sonnet 4.6 | Growth: search excellence, compare, similar |
| 18 | **F7** — Public portfolios + social foundations | Func | Sonnet 4.6 | Growth: viral loop |
| 19 | **F8** — Community (reviews + comments) | Func | Sonnet 4.6 | Growth: catalog → community |
| 20 | **F9** — AI-powered insights | Func | Opus 4.7 | Growth: Claude-backed differentiation |

After session 20, reassess with real usage data before committing to Phases C/D/E.
