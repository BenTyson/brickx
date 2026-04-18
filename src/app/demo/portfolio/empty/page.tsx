import type { Metadata } from "next";
import { EmptyPortfolio } from "@/components/portfolio-v2/empty-portfolio";

export const metadata: Metadata = {
  title: "Portfolio · empty state · BrickX demo",
  robots: { index: false, follow: false },
};

export default function PortfolioEmptyDemoPage() {
  return (
    <main className="bg-bg-base pb-24">
      <div className="mx-auto max-w-[1320px] px-6 pb-6 pt-10 sm:px-10 lg:px-14">
        <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
          Portfolio · empty state
        </div>
      </div>
      <div className="mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-14">
        <EmptyPortfolio />
      </div>
    </main>
  );
}
