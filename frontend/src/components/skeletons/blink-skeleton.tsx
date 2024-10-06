import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BlinkCardSkeleton() {
  return (
    <Card className="w-full h-[620px]">
      <CardContent className="p-6">
        <Skeleton className="h-[400px] w-full mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 mt-4 w-full" />
      </CardContent>
    </Card>
  );
}
