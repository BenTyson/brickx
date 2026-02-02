import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface MarketHubCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  count?: number;
  className?: string;
}

export function MarketHubCard({
  title,
  description,
  href,
  icon: Icon,
  count,
  className,
}: MarketHubCardProps) {
  return (
    <Link href={href} className="group">
      <Card
        className={cn(
          "transition-all group-hover:scale-[1.02] group-hover:shadow-lg",
          className,
        )}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
              <Icon className="text-primary size-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {count != null && (
                <p className="text-muted-foreground text-sm">
                  {count.toLocaleString()} sets
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
