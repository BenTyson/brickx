import { PieChart, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/page-container";

const features = [
  {
    title: "Portfolio Tracking",
    description:
      "Track the value of your LEGO collection in real time. See gains, losses, and total portfolio worth at a glance.",
    icon: PieChart,
  },
  {
    title: "Price Intelligence",
    description:
      "Aggregated pricing from multiple sources gives you the most accurate market values for any LEGO set.",
    icon: TrendingUp,
  },
  {
    title: "Investment Insights",
    description:
      "Data-driven investment scores help you identify sets with the highest appreciation potential.",
    icon: Target,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <PageContainer>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to invest in LEGO
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            From price tracking to portfolio management, BrickX gives you the
            tools to make informed decisions.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card/50">
              <CardHeader>
                <div className="bg-primary/10 mb-2 flex size-12 items-center justify-center rounded-lg">
                  <feature.icon
                    className="text-primary size-6"
                    aria-hidden="true"
                  />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
