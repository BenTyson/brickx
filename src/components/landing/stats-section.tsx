import { PageContainer } from "@/components/page-container";

const stats = [
  { value: "26,000+", label: "LEGO Sets Tracked" },
  { value: "Real-Time", label: "Price Updates" },
  { value: "~11%", label: "Avg. Annual Returns" },
  { value: "100%", label: "Free to Use" },
];

export function StatsSection() {
  return (
    <section className="bg-card/50 border-y">
      <PageContainer className="py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold tracking-tight sm:text-3xl">
                {stat.value}
              </div>
              <div className="text-muted-foreground mt-1 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
