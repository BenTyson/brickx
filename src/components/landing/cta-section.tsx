import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/page-container";

export function CtaSection() {
  return (
    <section className="border-t py-20">
      <PageContainer>
        <div className="bg-card relative overflow-hidden rounded-2xl border p-8 sm:p-12">
          {/* Gradient background */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_70%)] opacity-10"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Start Investing in LEGO?
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Join thousands of collectors and investors tracking their LEGO
              portfolios with BrickX.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="#">Get Started Free</Link>
              </Button>
            </div>
            <p className="text-muted-foreground mt-4 text-sm">
              No credit card required
            </p>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
