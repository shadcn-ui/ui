import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/styles/base-rhea/ui/card"
import { Skeleton } from "@/styles/base-rhea/ui/skeleton"

const bars = [60, 80, 65, 95, 50, 100]

export function ContributionHistory() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-44 rounded-md" />
        <Skeleton className="h-4 w-52 rounded-md" />
      </CardHeader>
      <CardContent>
        <div className="flex h-[200px] w-full items-end gap-3">
          {bars.map((height, i) => (
            <div
              key={i}
              className="flex h-full flex-1 flex-col justify-end gap-2"
            >
              <Skeleton
                className="w-full rounded-t-md rounded-b-none"
                style={{ height: `${height}%` }}
              />
              <Skeleton className="mx-auto h-3 w-6 rounded-md" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardContent>
        <div className="grid w-full grid-cols-1 gap-3 xl:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl bg-muted p-4">
            <Skeleton className="h-3 w-20 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-5 w-28 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-3 w-24 rounded-md bg-muted-foreground/15" />
          </div>
          <div className="hidden flex-col gap-2 rounded-xl bg-muted p-4 xl:flex">
            <Skeleton className="h-3 w-24 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-5 w-32 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-3 w-28 rounded-md bg-muted-foreground/15" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardFooter>
    </Card>
  )
}
