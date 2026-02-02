import Link from "next/link";
import { Blocks } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="py-16">
        <PageContainer className="flex flex-col items-center text-center">
          <Blocks className="text-muted-foreground/50 mb-6 size-20" />
          <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-muted-foreground mt-2 max-w-md text-lg">
            The page you&apos;re looking for doesn&apos;t exist. It may have
            been moved or the URL might be incorrect.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild>
              <Link href="/sets">Browse Sets</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
