import { Search, FolderPlus, LineChart } from "lucide-react";
import { PageContainer } from "@/components/page-container";

const steps = [
  {
    number: 1,
    title: "Browse",
    description:
      "Explore our catalog of 26,000+ LEGO sets with real-time pricing data from multiple sources.",
    icon: Search,
  },
  {
    number: 2,
    title: "Build Portfolio",
    description:
      "Add sets you own or want to track. Monitor their value over time and see your total investment.",
    icon: FolderPlus,
  },
  {
    number: 3,
    title: "Decide",
    description:
      "Use investment scores, price trends, and market data to buy, hold, or sell at the right time.",
    icon: LineChart,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20">
      <PageContainer>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Getting started with LEGO investing is simple.
          </p>
        </div>

        <div className="relative mt-12">
          {/* Connecting line (desktop) */}
          <div
            className="bg-border absolute top-16 right-0 left-0 hidden h-px md:block"
            aria-hidden="true"
          />

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number circle */}
                <div className="border-primary bg-background text-primary relative z-10 flex size-12 items-center justify-center rounded-full border-2 text-lg font-bold">
                  {step.number}
                </div>
                {/* Icon */}
                <div className="bg-primary/10 mt-4 flex size-14 items-center justify-center rounded-xl">
                  <step.icon
                    className="text-primary size-7"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
