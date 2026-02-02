import type { Metadata } from "next";
import { TrendingUp, Archive, Sparkles, Trophy } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { MarketHubCard } from "@/components/market/market-hub-card";
import { SetCard } from "@/components/set-card";
import { fetchTrendingSets } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Market Intelligence | BrickX",
  description:
    "Explore LEGO market trends, retiring sets, new releases, and top investment opportunities.",
};

export default async function MarketPage() {
  const trending = await fetchTrendingSets("7d", 1, 6);

  return (
    <div className="py-8">
      <PageContainer className="space-y-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Market Intelligence
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover trends, opportunities, and insights across the LEGO
            secondary market.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <MarketHubCard
            title="Trending"
            description="Sets with the biggest price movements over the past 7 and 30 days."
            href="/market/trending"
            icon={TrendingUp}
          />
          <MarketHubCard
            title="Retiring Sets"
            description="Recently retired sets that may appreciate in value on the secondary market."
            href="/market/retiring"
            icon={Archive}
          />
          <MarketHubCard
            title="New Releases"
            description="The latest LEGO sets released this year and last."
            href="/market/new-releases"
            icon={Sparkles}
          />
          <MarketHubCard
            title="Top Investments"
            description="Highest-rated sets by investment score across all price ranges."
            href="/market/top-investments"
            icon={Trophy}
          />
        </div>

        {/* Trending preview */}
        {trending.sets.length > 0 && (
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">
              Trending This Week
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trending.sets.map((set) => (
                <SetCard key={set.id} set={set} />
              ))}
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
