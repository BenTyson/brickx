import Link from "next/link";
import { Package } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";

export default function SetNotFound() {
  return (
    <div className="py-16">
      <PageContainer className="flex flex-col items-center text-center">
        <Package className="text-muted-foreground/50 mb-6 size-20" />
        <h1 className="text-3xl font-bold tracking-tight">Set Not Found</h1>
        <p className="text-muted-foreground mt-2 max-w-md text-lg">
          The LEGO set you&apos;re looking for doesn&apos;t exist or may have
          been removed from our database.
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
    </div>
  );
}
