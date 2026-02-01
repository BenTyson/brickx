import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SetCard } from "@/components/set-card";
import { PageContainer } from "@/components/page-container";
import { mockSets } from "@/lib/mock-data";

export function FeaturedSetsSection() {
  const featured = mockSets.slice(0, 6);

  return (
    <section id="featured-sets" className="border-t py-20">
      <PageContainer>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Sets
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Explore popular LEGO sets and their current market values.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((set) => (
            <SetCard key={set.setNumber} {...set} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="#">Browse All Sets</Link>
          </Button>
        </div>
      </PageContainer>
    </section>
  );
}
