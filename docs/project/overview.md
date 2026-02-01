BrickX — LEGO Investment Platform Build Plan │
│ │
│ Business Context (Summary) │
│ │
│ Strategy: Build a "StockX for LEGO" — an investment-grade portfolio │
│ tracker and marketplace that treats LEGO as an asset class, not a flea │
│ market. │
│ │
│ Why it works: LEGO sets appreciate ~11% annually. 97% of bricks aren't │
│ in circulation. BrickLink (the dominant marketplace) is owned by LEGO │
│ Group and actively alienating its user base with a botched account │
│ merge, hidden fees, and terrible UX. The AFOL market is 15%+ of LEGO's │
│ consumer base and growing fastest. │
│ │
│ Phased approach: │
│ 1. Phase 1 (NOW): Free portfolio tracker & price guide — builds │
│ audience │
│ 2. Phase 2 (LATER): StockX-style bid/ask marketplace — monetizes │
│ audience │
│ 3. Phase 3 (LATER): AI supply-side tools — expands inventory │
│ │
│ Closest competitor: BrickVault (brickvault.app) — dark PWA with │
│ portfolio tracking but uses local storage only, no cloud sync, manual │
│ ID recovery, limited UX. BrickEconomy is the price guide incumbent but │
│ desktop-only with dated UI. We beat both by being mobile-first, │
│ cloud-synced, and visually stunning. │
│ │
│ See full business analysis, competitive landscape, and market data in │
│ the conversation history above. │
│ │
│ --- │
│ Data Layer Architecture (Critical — Read First) │
│ │
│ Available APIs (Verified) │
│ Source: Rebrickable │
│ Purpose: Catalog (sets, parts, themes, images, minifigs) │
│ Auth: API key (free) │
│ Rate Limit: Unspecified (use CSV downloads for bulk) │
│ Key Data: 26K sets, 60K parts, 16K minifigs. Best free catalog source. │
│ ──────────────────────────────────────── │
│ Source: BrickLink │
│ Purpose: Market pricing (sold prices, current prices) │
│ Auth: OAuth1 (requires seller account) │
│ Rate Limit: 5,000 req/day │
│ Key Data: Price Guide endpoint: avg sold price, min/max, qty. PRIMARY │
│ pricing. │
│ ──────────────────────────────────────── │
│ Source: BrickEconomy │
│ Purpose: Investment analytics (values, growth rates, forecasts) │
│ Auth: API key (free account) │
│ Rate Limit: 100 req/day, 4 req/min │
│ Key Data: Set values, growth %, appreciation data. SUPPLEMENTARY │
│ pricing. │
│ ──────────────────────────────────────── │
│ Source: BrickOwl │
│ Purpose: Secondary marketplace pricing + availability │
│ Auth: API key (free account) │
│ Rate Limit: 600 req/min (100/min for bulk) │
│ Key Data: Catalog search, availability by country, pricing across │
│ stores. │
│ ──────────────────────────────────────── │
│ Source: eBay Browse API │
│ Purpose: Active listings only │
│ Auth: OAuth2 (production access requires application) │
│ Rate Limit: Per-app limits │
│ Key Data: Active listings ONLY. Sold listings are NOT available to │
│ regular │
│ developers (restricted to approved partners via Marketplace │
│ Insights API). │
│ Data Strategy │
│ │
│ Catalog source: Rebrickable. Download their CSV files for initial │
│ database seeding (sets, themes, parts, colors, minifigs). Use their API │
│ for incremental updates and search. This gives us 26,093 sets on day │
│ one. │
│ │
│ Pricing source (primary): BrickLink Price Guide API. Provides average │
│ sold prices for new and used conditions over the last 6 months. At │
│ 5,000 requests/day, we can update ~5,000 sets/day. Priority: update the │
│ most popular/valuable sets first, less popular sets on a rolling │
│ schedule. │
│ │
│ Pricing source (supplementary): BrickEconomy API. 100 requests/day is │
│ very limited — use this for investment-specific data (growth rates, │
│ forecasts) on the top sets only, not as a primary price source. │
│ │
│ Pricing source (additional): BrickOwl availability endpoint. Good for │
│ cross-referencing current asking prices across stores. 600 req/min is │
│ generous. │
│ │
│ What we do NOT have: eBay sold prices. This is a meaningful gap. │
│ Mitigation: BrickLink's sold price data is the community standard │
│ anyway — it's what BrickEconomy itself uses as a source. We can also │
│ display current eBay active listings as a "buy now" reference without │
│ needing sold data. │
│ │
│ Caching strategy: Store all price data in Supabase (PostgreSQL). Prices │
│ don't change by the minute — refresh popular sets daily, others │
│ weekly. Serve from our own DB, never make API calls on user request. │
│ │
│ Price aggregation: For each set, store: BrickLink new avg, BrickLink │
│ used avg, BrickOwl current asking, retail MSRP (from Rebrickable), │
│ BrickEconomy value estimate. Display a "market value" that weights │
│ these sources (BrickLink sold price has the most weight since it │
│ reflects actual transactions). │
│ │
│ --- │
│ UI/UX Design Philosophy │
│ │
│ The #1 differentiator is design. Every competitor in this space has │
│ mediocre-to-bad UI. BrickLink looks like it was built in 2003 (it was). │
│ BrickEconomy is functional but generic. BrickVault is dark but basic. │
│ We need to look like Robinhood meets Spotify — clean, dark, data-rich, │
│ and delightful. │
│ │
│ Design Principles │
│ │
│ 1. Dark mode default — 82% of users prefer dark for extended sessions. │
│ Use dark grays (#0A0A0B, #141416, #1C1C1F) not pure black. Subtle card │
│ elevation with soft borders. │
│ 2. Data density without clutter — Show more data than competitors but │
│ with clear hierarchy. Use color, spacing, and typography to guide the │
│ eye. │
│ 3. Motion and delight — Subtle animations on page transitions, number │
│ changes (counting up/down), chart reveals. Not gratuitous — purposeful. │
│ 4. Investment-grade visual language — Green for gains, red for losses. │
│ Sparkline charts in tables. Badge system for set status (Retired, │
│ Active, Retiring Soon, Exclusive). Think Bloomberg Terminal aesthetics │
│ applied to LEGO. │
│ 5. Mobile-first responsive — Every page must work perfectly on phone. │
│ The portfolio dashboard should feel like checking your stock portfolio │
│ on Robinhood. │
│ │
│ Design Stack │
│ │
│ - shadcn/ui — Radix primitives + Tailwind. Fully customizable, │
│ accessible, composable. │
│ - Tailwind CSS — Utility-first, custom theme tokens for our brand │
│ - Framer Motion — Page transitions, list animations, number animations, │
│ chart reveals │
│ - Recharts — Price history charts, portfolio value over time, │
│ sparklines │
│ - Lucide icons — Clean, consistent iconography │
│ - next/image — Optimized LEGO set images (high quality matters for a │
│ visual product) │
│ - Inter font — Clean, modern, excellent at small sizes for data-dense │
│ UI │
│ │
│ Color Palette (Dark Theme) │
│ │
│ Background: #0A0A0B (deepest), #141416 (card), #1C1C1F (elevated) │
│ Border: #2A2A2E (subtle), #3A3A3F (emphasis) │
│ Text: #FAFAFA (primary), #A1A1AA (secondary), #71717A │
│ (muted) │
│ Accent/Brand: #3B82F6 (blue — trust, investment), #60A5FA (blue │
│ light) │
│ Success/Gain: #22C55E (green) │
│ Danger/Loss: #EF4444 (red) │
│ Warning: #F59E0B (amber — retiring soon) │
│ Info: #8B5CF6 (purple — special/exclusive) │
│ │
│ --- │
│ Terminal Session Breakdown │
│ │
│ Development port: 5699 (locked in — use next dev -p 5699 and configure │
│ in package.json scripts) │
│ │
│ Each session is completely self-contained. Start fresh each session — │
│ do NOT reference work from previous sessions by memory. Each session │
│ has explicit inputs (what should already exist) and outputs (what will │
│ exist when done). │
│ │
│ --- │
│ SESSION 1: Project Foundation & Data Pipeline │
│ │
│ Goal │
│ │
│ Set up the project from scratch with all infrastructure, database │
│ schema, API integrations, and data seeding. At the end of this session, │
│ we have a fully populated database with 26K+ LEGO sets and working │
│ price data — but NO user-facing UI beyond a health check endpoint. │
│ │
│ Pre-requisites │
│ │
│ - Node.js 20 installed │
│ - Supabase project created (free tier — see API Key Setup Guide below) │
│ - API keys obtained: Rebrickable, BrickLink (OAuth1 credentials), │
│ BrickEconomy, BrickOwl (see setup guide below) │
│ │
│ Deliverables │
│ │
│ 1. Next.js 15 project (in /Users/bentyson/lego/) with TypeScript, │
│ Tailwind CSS, ESLint, Prettier — dev server on port 5699 │
│ 2. Supabase database with complete schema (migrations via Supabase CLI │
│ or raw SQL) │
│ 3. Supabase client configuration (@supabase/supabase-js + │
│ @supabase/ssr) │
│ 4. Rebrickable CSV data downloaded and seeded into database (sets, │
│ themes, parts, colors, minifigs) │
│ 5. API service modules for BrickLink, BrickEconomy, BrickOwl, │
│ Rebrickable │
│ 6. Price aggregation service that normalizes data from all sources │
│ 7. Background job / cron script to refresh pricing data on schedule │
│ 8. Health check API endpoint confirming DB connectivity and data counts │
│ 9. Environment variable configuration (.env.example documented) │
│ │
│ Database Schema (Key Tables) │
│ │
│ themes │
│ id, name, parent_id, created_at │
│ │
│ sets │
│ id (e.g. "75192-1"), name, year, theme_id, num_parts, num_minifigs │
│ img_url, set_url, msrp_usd, status (active/retired/retiring_soon) │
│ created_at, updated_at │
│ │
│ set_prices (price snapshots — one row per set per fetch) │
│ id, set_id, source (bricklink/brickowl/brickeconomy) │
│ new_avg, new_min, new_max, new_qty_sold │
│ used_avg, used_min, used_max, used_qty_sold │
│ fetched_at │
│ │
│ set_market_values (computed — current best estimate) │
│ set_id, market_value_new, market_value_used │
│ pct_change_7d, pct_change_30d, pct_change_90d │
│ growth_annual_pct, investment_score │
│ updated_at │
│ │
│ colors │
│ id, name, rgb, is_trans │
│ │
│ parts │
│ part_num, name, category_id, img_url │
│ │
│ minifigs │
│ fig_num, name, num_parts, img_url │
│ │
│ users │
│ id, email, name, avatar_url, provider, created_at │
│ │
│ collections │
│ id, user_id, name (e.g. "My Collection", "Wishlist", "For Sale") │
│ created_at │
│ │
│ collection_items │
│ id, collection_id, set_id │
│ condition (sealed/opened_complete/opened_incomplete) │
│ purchase_price, purchase_date, notes │
│ created_at, updated_at │
│ │
│ Data Seeding Process │
│ │
│ 1. Download Rebrickable CSV files: sets.csv, themes.csv, parts.csv, │
│ colors.csv, minifigs.csv, inventories.csv │
│ 2. Parse and insert into Supabase PostgreSQL in dependency order │
│ (themes first, then sets, etc.) │
│ 3. For the top 1,000 most popular/valuable sets: fetch BrickLink Price │
│ Guide data │
│ 4. For the top 500: also fetch BrickEconomy growth data │
│ 5. Compute set_market_values from aggregated pricing │
│ 6. Log all seeding stats (rows inserted, errors, timing) │
│ │
│ Supabase-Specific Setup │
│ │
│ - Enable Row Level Security (RLS) on user-facing tables (users, │
│ collections, collection_items) │
│ - Public read access on catalog tables (sets, themes, parts, colors, │
│ minifigs, set_prices, set_market_values) │
│ - Create database indexes: sets(name) for search, sets(theme_id) for │
│ browsing, set_prices(set_id, fetched_at) for history, │
│ collection_items(collection_id) for listing │
│ - Use Supabase SQL Editor or migrations for schema management │
│ │
│ API Service Architecture │
│ │
│ Each external API gets its own service module with: │
│ - Rate limiting (respect each API's limits with token bucket) │
│ - Retry logic with exponential backoff │
│ - Response type definitions (TypeScript interfaces) │
│ - Error classification (rate limit vs auth vs network vs data) │
│ - Response caching in DB (never hit external APIs on user requests) │
│ │
│ What this session does NOT include │
│ │
│ - No UI components, no pages, no design system │
│ - No user authentication │
│ - No frontend routing │
│ - Just the data foundation │
│ │
│ --- │
│ SESSION 2: Design System, Layout & Marketing Pages │
│ │
│ Goal │
│ │
│ Build the complete design system, application shell (nav, layout, │
│ footer), and the marketing/landing page. At the end of this session, │
│ the app has a stunning landing page, working navigation, and all shared │
│ components — but NO data-connected features yet (those use mock data │
│ for visual development). │
│ │
│ Pre-requisites (from Session 1) │
│ │
│ - Next.js project exists with TypeScript + Tailwind │
│ - Database is seeded and running │
│ - All Session 1 deliverables are complete │
│ │
│ Deliverables │
│ │
│ 1. shadcn/ui installed and configured with custom dark theme │
│ 2. Tailwind theme with full color palette, typography scale, spacing, │
│ border radius tokens │
│ 3. Design system components (all reusable primitives): │
│ - Button (primary, secondary, ghost, destructive — all sizes) │
│ - Card (default, interactive/hover, glass effect) │
│ - Badge (status badges: Retired, Active, Retiring Soon, Exclusive, │
│ New) │
│ - Input, Select, Combobox (search autocomplete) │
│ - Dialog/Modal, Sheet (slide-over panel) │
│ - Table (sortable, with sparkline cells) │
│ - Chart components (line chart, area chart, sparkline — via Recharts │
│ wrappers) │
│ - Stat card (value + delta + sparkline — like Robinhood portfolio │
│ stat) │
│ - Skeleton loaders (for every component that loads data) │
│ - Empty states (illustrated, with CTAs) │
│ - Toast notifications │
│ - Avatar, Dropdown menu, Tooltip │
│ 4. Application shell: │
│ - Top nav bar (logo, search bar, auth buttons) │
│ - Mobile bottom tab navigation (Dashboard, Search, Collection, │
│ Alerts, Profile) │
│ - Sidebar navigation for desktop │
│ - Page transition animations (Framer Motion) │
│ - Responsive breakpoints verified on phone/tablet/desktop │
│ 5. Landing page (marketing): │
│ - Hero section with value prop + screenshot/mockup │
│ - Features grid (portfolio tracking, price alerts, market data, etc.) │
│ - Social proof section (stats: "26,000+ sets tracked", "Real-time │
│ pricing") │
│ - CTA sections (sign up free) │
│ - Footer with links │
│ 6. Global styles: │
│ - Custom scrollbar styling (dark) │
│ - Focus ring styles (accessible) │
│ - Selection color │
│ - Smooth scroll behavior │
│ - Font loading (Inter via next/font) │
│ │
│ UI Component Specifications │
│ │
│ Stat Card (used everywhere): │
│ ┌─────────────────────────────┐ │
│ │ Portfolio Value │ │
│ │ $12,847.00 ▲ 8.3% │ │
│ │ ████████▄▄▃▃▅▆██ (spark) │ │
│ └─────────────────────────────┘ │
│ - Value animates on change (counting up/down with Framer Motion) │
│ - Delta shows green/red with arrow │
│ - Sparkline shows 30-day trend │
│ - Hover reveals tooltip with exact dates/values │
│ │
│ Set Card (grid item): │
│ ┌─────────────────────────────┐ │
│ │ [Set Image - 4:3 ratio] │ │
│ │ │ │
│ │ ┌──────────┐ │ │
│ │ │ RETIRING │ │ │
│ │ └──────────┘ │ │
│ │ UCS Millennium Falcon │ │
│ │ 75192 · Star Wars · 2017 │ │
│ │ $849.99 → $1,247.00 │ │
│ │ ▲ 46.7% all time │ │
│ └─────────────────────────────┘ │
│ - Image lazy loads with blur placeholder │
│ - Badge system: color-coded status │
│ - Price shows MSRP → current market value │
│ - Percentage shows total appreciation │
│ - Hover: subtle scale + shadow lift │
│ │
│ Price Chart (set detail): │
│ - Interactive area chart (Recharts) │
│ - Time range selector: 1M, 3M, 6M, 1Y, ALL │
│ - Hover shows crosshair with exact price/date │
│ - Gradient fill under line (blue/green based on trend) │
│ - Overlay: key events (retirement date, re-release, etc.) │
│ │
│ What this session does NOT include │
│ │
│ - No data fetching from database (use hardcoded mock data for visual │
│ dev) │
│ - No authentication flows │
│ - No collection management │
│ - No API routes beyond health check │
│ - Pure visual/component work │
│ │
│ --- │
│ SESSION 3: Set Catalog, Search & Detail Pages │
│ │
│ Goal │
│ │
│ Wire up the Rebrickable catalog data to the UI. Build the core browsing │
│ experience — search, catalog, set detail pages with real pricing data. │
│ At the end of this session, users can search and browse the full LEGO │
│ catalog with real market data, but cannot create accounts or save │
│ collections. │
│ │
│ Pre-requisites (from Sessions 1 + 2) │
│ │
│ - Database seeded with 26K+ sets, themes, pricing data │
│ - Design system and all shared components built │
│ - Application shell (nav, layout) in place │
│ │
│ Deliverables │
│ │
│ 1. Search page: │
│ - Search bar with instant autocomplete (debounced, shows top 5 │
│ results as user types) │
│ - Search results page with grid/list toggle │
│ - Filters: theme, year range, price range, status │
│ (active/retired/retiring), piece count range │
│ - Sort: price (low/high), name, year, appreciation %, investment │
│ score │
│ - Infinite scroll or pagination │
│ - "No results" empty state │
│ 2. Catalog browse page: │
│ - Browse by theme (grid of theme cards with set counts) │
│ - Theme detail page (all sets in that theme, filterable/sortable) │
│ - "Popular themes" featured section │
│ 3. Set detail page: │
│ - Large set image (with zoom on hover/tap) │
│ - Set metadata: name, number, theme, year, piece count, minifig │
│ count, age range │
│ - Price section: MSRP, current market value (new + used), │
│ appreciation % │
│ - Price history chart (interactive, with time range selector) │
│ - "Price sources" breakdown (BrickLink avg, BrickOwl asking, │
│ BrickEconomy estimate) │
│ - Related sets (same theme, similar price range) │
│ - "Add to Collection" / "Add to Wishlist" buttons (disabled until │
│ auth — Session 4) │
│ 4. API routes: │
│ - GET /api/sets — paginated search with filters │
│ - GET /api/sets/[id] — single set with full pricing data │
│ - GET /api/sets/[id]/price-history — time series price data │
│ - GET /api/themes — all themes │
│ - GET /api/themes/[id]/sets — sets by theme │
│ - GET /api/search — autocomplete endpoint (fast, returns top matches) │
│ 5. Server-side rendering / ISR: │
│ - Set detail pages use ISR (revalidate every hour) │
│ - Search is client-side with API calls │
│ - Theme pages use ISR (revalidate daily) │
│ 6. Image handling: │
│ - Rebrickable provides set images — cache via next/image │
│ - Blur placeholder generation for loading states │
│ - Fallback image for sets without photos │
│ │
│ Data Flow │
│ │
│ User types search → debounced API call → PostgreSQL full-text search → │
│ return top results │
│ User clicks set → ISR page (pre-rendered or on-demand) → reads from set │
│ + set_market_values tables │
│ Price chart → API route queries set_prices table → returns time series │
│ │
│ Performance Targets │
│ │
│ - Search autocomplete: < 100ms response │
│ - Set detail page: < 500ms TTFB (ISR cache hit) │
│ - Price chart: < 200ms data load │
│ - Catalog browse: < 1s initial load, smooth infinite scroll │
│ │
│ What this session does NOT include │
│ │
│ - No user accounts or authentication │
│ - No collection management (buttons visible but disabled) │
│ - No alerts or notifications │
│ - No portfolio calculations │
│ │
│ --- │
│ SESSION 4: Authentication & Collection Management │
│ │
│ Goal │
│ │
│ Add user accounts and the core collection management features. At the │
│ end of this session, users can sign up, log in, add sets to their │
│ collection with purchase data, and see their portfolio dashboard with │
│ real valuations and gain/loss tracking. │
│ │
│ Pre-requisites (from Sessions 1–3) │
│ │
│ - Full catalog browsable with real pricing │
│ - All set detail pages working │
│ - Design system + components in place │
│ │
│ Deliverables │
│ │
│ 1. Authentication (via Supabase Auth — built-in, free, no extra │
│ dependencies): │
│ - Email/password sign up + sign in │
│ - Google OAuth sign in (configure in Supabase dashboard) │
│ - Email verification flow (Supabase handles email sending) │
│ - Password reset flow (built-in) │
│ - Protected route middleware (collection pages require auth) │
│ - Auth state management (Supabase session + React context via │
│ @supabase/ssr) │
│ 2. Collection management: │
│ - "Add to Collection" action on any set detail page │
│ - Add modal: select collection (My Collection / Wishlist / For Sale), │
│ condition, purchase price, purchase date, notes │
│ - Collection list page: all sets in a collection, sortable/filterable │
│ - Edit/remove items from collection │
│ - Bulk add: paste set numbers or upload CSV │
│ - Collection switcher (My Collection, Wishlist, For Sale tabs) │
│ 3. Portfolio dashboard (the flagship page): │
│ - Total value card: sum of all market values for owned sets │
│ - Total invested card: sum of all purchase prices entered │
│ - Total gain/loss card: value - invested, with percentage │
│ - Portfolio value over time chart: area chart showing collection │
│ value over time (computed from historical prices of owned sets) │
│ - Top performers table: sets with highest appreciation % in │
│ collection │
│ - Recent additions: last 5 sets added │
│ - Collection breakdown: pie chart by theme, by condition │
│ - Individual set rows: each set with image, name, purchase price, │
│ current value, gain/loss, sparkline │
│ 4. Wishlist features: │
│ - Wishlist page showing wishlisted sets with current prices │
│ - "Price target" per wishlisted set — "notify me when this drops │
│ below $X" (UI only — notification delivery in Session 5) │
│ 5. Data export: │
│ - Export collection as CSV (set number, name, condition, purchase │
│ price, current value) │
│ - Export as JSON │
│ │
│ Portfolio Value Calculation │
│ │
│ For each set in collection: │
│ if condition == "sealed": │
│ value = set_market_values.market_value_new │
│ else: │
│ value = set_market_values.market_value_used │
│ │
│ gain_loss = value - collection_item.purchase_price (if purchase_price │
│ provided) │
│ │
│ Portfolio total = sum(all set values) │
│ Portfolio gain = sum(all gain_loss where purchase_price exists) │
│ │
│ Historical portfolio value: for each day in range, look up the │
│ set_prices snapshot closest to that date for each set that was in the │
│ collection at that time. This requires tracking when sets were │
│ added/removed. │
│ │
│ What this session does NOT include │
│ │
│ - No email notifications (just UI for setting price targets) │
│ - No market intelligence features (trending, retiring soon, investment │
│ scores) │
│ - No animations/polish beyond what exists from Session 2 │
│ - No deployment │
│ │
│ --- │
│ SESSION 5: Market Intelligence, Alerts & Production Deploy │
│ │
│ Goal │
│ │
│ Add the market intelligence features that make this platform uniquely │
│ valuable — trending data, retirement alerts, investment scoring, price │
│ notifications. Polish all animations and interactions. Deploy to │
│ production. │
│ │
│ Pre-requisites (from Sessions 1–4) │
│ │
│ - Full catalog with pricing │
│ - User auth + collection management working │
│ - Portfolio dashboard functional │
│ │
│ Deliverables │
│ │
│ 1. Market intelligence pages: │
│ - Trending / Biggest Movers: sets with largest price changes in │
│ 7d/30d, sortable │
│ - Retiring Soon: sets expected to retire within 6 months (data from │
│ community sources + LEGO announcements — initially curated, later │
│ automated) │
│ - New Releases: recently released sets │
│ - Top Investments: highest investment score sets, filterable by price │
│ range │
│ - Investment score algorithm: weighted formula based on theme │
│ popularity, piece count, minifig exclusivity, retirement proximity, │
│ historical appreciation of similar sets │
│ 2. Price alerts: │
│ - Set price targets on wishlisted sets ("notify when below $X") │
│ - Alert for owned sets ("notify when value exceeds $X" — for selling) │
│ - Retiring soon alerts for owned themes │
│ - Email notification delivery (via Resend or SendGrid) │
│ - In-app notification bell with unread count │
│ - Notification preferences page │
│ 3. Animations & micro-interactions (Framer Motion): │
│ - Page transitions (fade + slide) │
│ - List item stagger animations (sets loading in sequence) │
│ - Number count-up animations on stat cards │
│ - Chart reveal animations │
│ - Card hover effects (scale + shadow) │
│ - Button press feedback │
│ - Toast slide-in animations │
│ - Skeleton → content transition (fade) │
│ 4. Performance optimization: │
│ - Audit with Lighthouse (target: 90+ on all scores) │
│ - Image optimization audit (all images via next/image with proper │
│ sizing) │
│ - Bundle analysis + code splitting │
│ - Database query optimization (indexes on frequently queried columns) │
│ - API response caching headers │
│ - ISR configuration tuned per page type │
│ 5. SEO & social: │
│ - Dynamic meta tags per page (set detail pages get set name + image) │
│ - Open Graph images (auto-generated for set detail pages) │
│ - Structured data (JSON-LD for product pages) │
│ - Sitemap generation │
│ - robots.txt │
│ 6. Production deployment: │
│ - Railway deployment (config already exists in repo) │
│ - Environment variables configured for production │
│ - Database migrations run │
│ - SSL/custom domain setup │
│ - Error tracking (Sentry) │
│ - Analytics (Posthog or Plausible — privacy-respecting) │
│ - Rate limiting on API routes │
│ - CORS configuration │
│ - Health check monitoring │
│ 7. Testing: │
│ - API route tests (critical paths: search, set detail, collection │
│ CRUD) │
│ - Price calculation tests (ensure portfolio values are accurate) │
│ - Auth flow smoke tests │
│ - Responsive design verified on real devices │
│ │
│ What this session does NOT include │
│ │
│ - No marketplace / buy-sell functionality (Phase 2 of business) │
│ - No AI identification (Phase 3) │
│ - No mobile native app │
│ - No social features │
│ │
│ --- │
│ Verification (End-to-End Test Plan) │
│ │
│ After all 5 sessions, manually verify: │
│ │
│ 1. Landing page: loads, looks stunning, responsive on phone │
│ 2. Search: type "millennium falcon" → instant autocomplete → results │
│ page with filters │
│ 3. Set detail: click a set → image, pricing, chart, metadata all │
│ display correctly │
│ 4. Sign up: create account with email → verify → log in │
│ 5. Add to collection: add 5 sets with purchase prices → see them in │
│ collection │
│ 6. Portfolio dashboard: total value, gain/loss, chart, breakdown all │
│ calculate correctly │
│ 7. Wishlist: add sets to wishlist, set price targets │
│ 8. Market pages: trending, retiring soon, top investments all populated │
│ 9. Alerts: set a price alert → receive email when triggered │
│ 10. Mobile: entire flow works on iPhone Safari │
│ │
│ --- │
│ API Key Setup Guide (Do This Before Session 1) │
│ │
│ Complete these in order. Budget ~30 minutes. │
│ │
│ 1. Supabase (Required — Database + Auth) │
│ │
│ 1. Go to https://supabase.com → Sign up (free) │
│ 2. Click "New Project" → Name: brickx → Set a database password → │
│ Region: closest to you │
│ 3. Wait for project to provision (~2 min) │
│ 4. Go to Settings → API → Copy: Project URL, anon (public) key, │
│ service_role (secret) key │
│ 5. Go to Settings → Database → Copy: Connection string (URI format) │
│ 6. You'll need: SUPABASE_URL, SUPABASE_ANON_KEY, │
│ SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL │
│ │
│ 2. Rebrickable (Required — LEGO Catalog Data) │
│ │
│ 1. Go to https://rebrickable.com → Create account (free) │
│ 2. Go to Profile → Settings → API → Generate API Key │
│ 3. You'll need: REBRICKABLE_API_KEY │
│ │
│ 3. BrickLink (Required — Market Pricing) │
│ │
│ 1. Go to https://www.bricklink.com → Create account │
│ 2. Become a seller: Go to My BrickLink → My Store → Start a Store (you │
│ don't need to list anything, just activate seller status) │
│ 3. Go to https://www.bricklink.com/v2/api/register_consumer.page │
│ 4. Register as API Consumer → Set callback URL to http://localhost:3000 │
│ → Set IP to 0.0.0.0 for both IP and mask │
│ 5. Generate tokens. You'll get 4 values: BRICKLINK_CONSUMER_KEY, │
│ BRICKLINK_CONSUMER_SECRET, BRICKLINK_TOKEN, BRICKLINK_TOKEN_SECRET │
│ │
│ 4. BrickEconomy (Recommended — Investment Analytics) │
│ │
│ 1. Go to https://www.brickeconomy.com → Create account (free) │
│ 2. Request API key from the API Reference page │
│ 3. You'll need: BRICKECONOMY_API_KEY │
│ 4. Note: 100 requests/day limit — this is supplementary data, not │
│ critical for MVP │
│ │
│ 5. BrickOwl (Optional — Secondary Pricing) │
│ │
│ 1. Go to https://www.brickowl.com → Create account (free) │
│ 2. Go to Account Settings → API → Generate Key │
│ 3. You'll need: BRICKOWL_API_KEY │
│ 4. Note: Nice to have for price cross-referencing, but not blocking │
│ │
│ 6. Resend (Session 5 Only — Email Notifications) │
│ │
│ 1. Go to https://resend.com → Sign up (free) │
│ 2. Create API key │
│ 3. You'll need: RESEND_API_KEY │
│ 4. Free tier: 100 emails/day (plenty for early stage) │
│ │
│ --- │
│ Sources │
│ │
│ - https://rebrickable.com/api/ │
│ - https://www.bricklink.com/v2/api/welcome.page │
│ - https://www.brickeconomy.com/api-reference │
│ - https://www.brickowl.com/api_docs │
│ - https://developer.ebay.com/api-docs/buy/browse/overview.html │
│ - https://brickset.com/article/124366/lego-achieves-continued-growth-an │
│ d-record-revenue-in-1h-2025 │
│ - https://www.uprightlabs.com/2025/03/07/lego-dominates-resale/ │
│ - https://ddbricks.com/post/bricklink-vs-brickowl-unveiling-the-best-le │
│ go-marketplace-for-you/ │
│ - https://investabrick.com/articles/maximize-your-lego-selling-profits │
│ - https://www.brickfanatics.com/lego-bricklink-integration-outage-frust │
│ rated/ │
│ - https://brickvault.app/ │
│ - https://ddbricks.com/post/the-rise-of-adult-fans-of-lego-afol-the-gro │
│ wing-popularity-of-lego-among-adults/
