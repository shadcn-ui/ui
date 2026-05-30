import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/styles/base-rhea/ui/card"
import { Skeleton } from "@/styles/base-rhea/ui/skeleton"

export function PayoutThreshold() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-44 rounded-md" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-32 rounded-md" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <Skeleton className="h-3 w-40 rounded-md" />
            <Skeleton className="h-7 w-24 rounded-md" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-[100px] w-full rounded-lg" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardFooter>
    </Card>
  )
}
