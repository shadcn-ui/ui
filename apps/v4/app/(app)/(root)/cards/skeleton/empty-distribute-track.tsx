import { Card, CardContent } from "@/styles/base-rhea/ui/card"
import { Skeleton } from "@/styles/base-rhea/ui/skeleton"

export function EmptyDistributeTrack() {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center gap-4 p-4">
          <Skeleton className="size-12 rounded-xl" />
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-3 w-64 rounded-md" />
            <Skeleton className="h-3 w-48 rounded-md" />
          </div>
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}
