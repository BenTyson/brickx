import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function SetCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-0">
        <Skeleton className="aspect-square w-full rounded-lg" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-5 w-16" />
        <div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="mt-1 h-4 w-1/2" />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1">
        <div className="flex w-full items-baseline justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex w-full justify-end">
          <Skeleton className="h-4 w-16" />
        </div>
      </CardFooter>
    </Card>
  );
}
