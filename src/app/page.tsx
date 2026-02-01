import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FeaturedSetsSection } from "@/components/landing/featured-sets-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { CtaSection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <>
      {/* Skip to content link for keyboard users */}
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground fixed top-4 left-4 z-[100] -translate-y-16 rounded-md px-4 py-2 text-sm font-medium transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <FeaturedSetsSection />
        <HowItWorksSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </>
  );
}
