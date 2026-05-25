import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/styles/base-rhea/ui/card"
import { Skeleton } from "@/styles/base-rhea/ui/skeleton"

const bars = [30, 70, 80, 60, 90, 75, 100, 85]

export function PowerUsage() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex h-[140px] w-full items-end gap-2">
          {bars.map((height, i) => (
            <div
              key={i}
              className="flex h-full flex-1 flex-col justify-end gap-1.5"
            >
              <Skeleton
                className="w-full rounded-t rounded-b-none"
                style={{ height: `${height}%` }}
              />
              <Skeleton className="mx-auto h-3 w-5 rounded-md" />
            </div>
          ))}
        </div>
        <Skeleton className="h-px w-full rounded-none" />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-28 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <Skeleton className="h-3 w-24 rounded-md" />
        <div className="flex w-full items-center gap-2">
          <Skeleton className="h-2 flex-1 rounded-full" />
          <Skeleton className="h-3 w-10 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  )
}
