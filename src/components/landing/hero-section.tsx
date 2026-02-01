import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/page-container";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--primary)_0%,_transparent_50%)] opacity-15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--info)_0%,_transparent_50%)] opacity-10"
        aria-hidden="true"
      />

      <PageContainer className="relative py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Invest in{" "}
              <span className="from-primary to-info bg-gradient-to-r bg-clip-text text-transparent">
                LEGO
              </span>
            </h1>
            <p className="text-muted-foreground mt-6 max-w-lg text-lg">
              Track real-time pricing across 26,000+ LEGO sets. Build your
              portfolio, discover trends, and make data-driven investment
              decisions.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="#">Start Tracking Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#featured-sets">Browse Sets</Link>
              </Button>
            </div>
          </div>

          {/* Decorative dashboard mockup */}
          <div className="hidden lg:block" aria-hidden="true">
            <div className="relative mx-auto w-full max-w-md">
              {/* Main card */}
              <div className="bg-card rounded-xl border p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-muted-foreground text-sm font-medium">
                    Portfolio Value
                  </div>
                  <div className="bg-success/15 text-success rounded-full px-2 py-0.5 text-xs font-medium">
                    +18.4%
                  </div>
                </div>
                <div className="text-3xl font-bold">$12,847</div>
                <div className="mt-6 space-y-3">
                  {[
                    {
                      name: "Millennium Falcon",
                      value: "$949",
                      change: "+11.8%",
                    },
                    {
                      name: "Hogwarts Castle",
                      value: "$579",
                      change: "+45.0%",
                    },
                    { name: "Colosseum", value: "$699", change: "+27.3%" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="bg-muted/50 flex items-center gap-3 rounded-lg p-3"
                    >
                      <div className="bg-primary/10 flex size-8 items-center justify-center rounded">
                        <Package className="text-primary size-4" />
                      </div>
                      <div className="flex-1 text-sm font-medium">
                        {item.name}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {item.value}
                        </div>
                        <div className="text-success text-xs">
                          {item.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating accent card */}
              <div className="bg-card absolute -bottom-4 -left-4 rounded-lg border p-3 shadow-lg">
                <div className="text-muted-foreground text-xs">
                  Avg. Annual Return
                </div>
                <div className="text-success text-lg font-bold">~11%</div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
