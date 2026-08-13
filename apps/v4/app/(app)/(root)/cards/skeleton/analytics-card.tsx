import { Card, CardAction, CardHeader } from "@/styles/base-rhea/ui/card"
import { Skeleton } from "@/styles/base-rhea/ui/skeleton"

export function AnalyticsCard() {
  return (
    <Card className="mx-auto w-full max-w-sm data-[size=sm]:pb-0" size="sm">
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-4 w-40 rounded-md" />
        <CardAction>
          <Skeleton className="h-7 w-28 rounded-lg" />
        </CardAction>
      </CardHeader>
      <Skeleton className="mx-6 mb-6 aspect-[1/0.35] w-auto rounded-lg" />
    </Card>
  )
}
