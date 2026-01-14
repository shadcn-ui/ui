import { Card, CardContent, CardHeader } from "@/examples/radix/ui/card"
import { Skeleton } from "@/examples/radix/ui/skeleton"

export function SkeletonCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-square w-full" />
      </CardContent>
    </Card>
  )
}
