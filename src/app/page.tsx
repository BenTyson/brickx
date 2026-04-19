import { SiteHeader } from "@/components/site-header";
import { randomWalk } from "@/lib/mock/series";
import { Hero } from "@/components/landing/hero";
import { TickerBar, type TickerItem } from "@/components/landing/ticker-bar";
import { PortfolioMockup } from "@/components/landing/portfolio-mockup";
import { BentoWhy } from "@/components/landing/bento-why";
import { IndexShowcase } from "@/components/landing/index-showcase";
import { FeaturedCarousel } from "@/components/landing/featured-carousel";
import { CompetitorTable } from "@/components/landing/competitor-table";
import { SocialProof } from "@/components/landing/social-proof";
import { Testimonials } from "@/components/landing/testimonials";
import { FinalCTA } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";

/* ── marketing mocks (deterministic, server-rendered) ─────────────
   Landing showcases what's possible. The portfolio mockup, ticker,
   and featured-set deltas are illustrative — real data appears
   after sign-in. ──────────────────────────────────────────────── */

const tickerItems: TickerItem[] = [
  { id: "75192", name: "Millennium Falcon UCS", delta: 2.3 },
  { id: "10294", name: "Titanic", delta: 12.4 },
  { id: "10255", name: "Assembly Square", delta: -2.8 },
  { id: "21322", name: "Pirates of Barracuda Bay", delta: 18.5 },
  { id: "42115", name: "Lamborghini Sián", delta: 8.9 },
  { id: "10297", name: "Boutique Hotel", delta: 1.7 },
  { id: "75313", name: "AT-AT UCS", delta: -1.2 },
  { id: "10276", name: "Colosseum", delta: 4.6 },
  { id: "10307", name: "Eiffel Tower", delta: 3.1 },
  { id: "71043", name: "Hogwarts Castle", delta: 6.2 },
];

const portfolioSeries = randomWalk({ points: 90, start: 10800, vol: 0.012, drift: 0.002, seed: 1 });
const unrealizedSeries = randomWalk({ points: 60, start: 900, vol: 0.025, seed: 3 });

const mockHoldings = [
  { id: "10294", name: "Titanic", series: randomWalk({ points: 30, start: 620, vol: 0.018, drift: 0.004, seed: 201 }).map((p) => p.v), value: 684, delta: 12.4 },
  { id: "75192", name: "Millennium Falcon UCS", series: randomWalk({ points: 30, start: 940, vol: 0.012, seed: 202 }).map((p) => p.v), value: 982, delta: 4.1 },
  { id: "21322", name: "Pirates of Barracuda Bay", series: randomWalk({ points: 30, start: 550, vol: 0.02, drift: 0.008, seed: 203 }).map((p) => p.v), value: 620, delta: 18.5 },
];

const activityFeed = [
  { id: "a1", text: "+47 sets tracked in the last hour" },
  { id: "a2", text: "Millennium Falcon UCS hit a new 30-day high", delta: 2.3 },
  { id: "a3", text: "Modulars index rebalanced — Assembly Square re-weighted" },
  { id: "a4", text: "14 price alerts fired this morning" },
  { id: "a5", text: "Titanic up for a 5th consecutive week", delta: 12.4 },
  { id: "a6", text: "BrickX 100 crossed 112.00 at 09:14 UTC", delta: 0.6 },
  { id: "a7", text: "3 sets flagged 'retiring soon'" },
  { id: "a8", text: "Lamborghini Sián added to Technic Heat Index", delta: 8.9 },
];

const bentoIndex = randomWalk({ points: 120, start: 100, vol: 0.009, drift: 0.0015, seed: 42 });

const indexCards = [
  {
    slug: "brickx-100",
    name: "BrickX 100",
    tone: "brand" as const,
    value: 112.46,
    delta: 2.31,
    series: randomWalk({ points: 180, start: 100, vol: 0.008, drift: 0.001, seed: 301 }),
    description:
      "The flagship benchmark. 100 most-tracked sets, float-weighted by aggregated market cap, rebalanced monthly.",
  },
  {
    slug: "star-wars-heat",
    name: "Star Wars Heat",
    tone: "warm" as const,
    value: 128.09,
    delta: 4.82,
    series: randomWalk({ points: 120, start: 100, vol: 0.014, drift: 0.002, seed: 302 }),
    description:
      "Theme heat tracker. 40 Star Wars sets weighted by 30-day trading volume.",
  },
  {
    slug: "modulars",
    name: "Modulars",
    tone: "cool" as const,
    value: 141.22,
    delta: 1.14,
    series: randomWalk({ points: 120, start: 100, vol: 0.007, drift: 0.0022, seed: 303 }),
    description:
      "Creator Expert Modulars. The blue-chip of LEGO indices — low volatility, compounding.",
  },
  {
    slug: "retired-gold",
    name: "Retired Gold",
    tone: "neutral" as const,
    value: 98.73,
    delta: -0.92,
    series: randomWalk({ points: 120, start: 100, vol: 0.012, drift: 0.0005, seed: 304 }),
    description:
      "The retirement class of 2022–2023. Tracks post-EOL appreciation curves.",
  },
];

const featuredSets = [
  { id: "10294", name: "Titanic", theme: "Creator Expert", year: 2021, status: "available" as const, msrp: 629.99, current: 684, delta: 12.4, series: randomWalk({ points: 45, start: 620, vol: 0.018, drift: 0.004, seed: 401 }) },
  { id: "75192", name: "Millennium Falcon Ultimate Collector Series", theme: "Star Wars", year: 2017, status: "retired" as const, msrp: 799.99, current: 982, delta: 4.1, series: randomWalk({ points: 45, start: 940, vol: 0.012, seed: 402 }) },
  { id: "10255", name: "Assembly Square", theme: "Modular", year: 2017, status: "retired" as const, msrp: 279.99, current: 412, delta: -2.8, series: randomWalk({ points: 45, start: 425, vol: 0.02, drift: -0.002, seed: 403 }) },
  { id: "21322", name: "Pirates of Barracuda Bay", theme: "Ideas", year: 2020, status: "retired" as const, msrp: 199.99, current: 620, delta: 18.5, series: randomWalk({ points: 45, start: 550, vol: 0.02, drift: 0.008, seed: 404 }) },
  { id: "42115", name: "Lamborghini Sián FKP 37", theme: "Technic", year: 2020, status: "available" as const, msrp: 379.99, current: 488, delta: 8.9, series: randomWalk({ points: 45, start: 450, vol: 0.022, drift: 0.003, seed: 405 }) },
  { id: "10276", name: "Colosseum", theme: "Creator Expert", year: 2020, status: "retired" as const, msrp: 549.99, current: 812, delta: 6.3, series: randomWalk({ points: 45, start: 780, vol: 0.015, drift: 0.002, seed: 406 }) },
  { id: "10307", name: "Eiffel Tower", theme: "Icons", year: 2022, status: "available" as const, msrp: 629.99, current: 698, delta: 3.1, series: randomWalk({ points: 45, start: 660, vol: 0.012, drift: 0.001, seed: 407 }) },
  { id: "71043", name: "Hogwarts Castle", theme: "Harry Potter", year: 2018, status: "retired" as const, msrp: 399.99, current: 612, delta: 6.2, series: randomWalk({ points: 45, start: 580, vol: 0.016, drift: 0.002, seed: 408 }) },
];

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground fixed top-4 left-4 z-[100] -translate-y-16 rounded-md px-4 py-2 text-sm font-medium transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content" className="bg-bg-base">
        <Hero />
        <TickerBar items={tickerItems} />

        <section className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 lg:px-14">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div className="lg:sticky lg:top-24">
              <div className="text-micro font-mono font-tabular text-text-tertiary">
                00 · A portfolio, not a pile
              </div>
              <h2 className="mt-4 text-h2 font-serif-display italic text-text-primary">
                Every set you own, scored and charted.
              </h2>
              <p className="mt-5 max-w-[440px] text-body text-text-secondary">
                Import a spreadsheet, scan a barcode, or add by set number. BrickX
                pulls live blended prices, tracks cost basis, and shows you what
                your collection is actually worth — down to the minifig.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <span className="text-micro font-mono font-tabular text-text-quaternary">
                  Illustrative preview · real data after sign-in
                </span>
              </div>
            </div>
            <PortfolioMockup
              portfolioSeries={portfolioSeries}
              unrealizedSeries={unrealizedSeries}
              holdings={mockHoldings}
            />
          </div>
        </section>

        <BentoWhy indexSeries={bentoIndex} activityFeed={activityFeed} />
        <IndexShowcase cards={indexCards} />
        <FeaturedCarousel sets={featuredSets} />
        <CompetitorTable />
        <SocialProof />
        <Testimonials />
        <FinalCTA />
      </main>

      <LandingFooter />
    </>
  );
}
