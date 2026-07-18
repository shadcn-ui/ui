import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/styles/base-rhea/ui/card"
import { Skeleton } from "@/styles/base-rhea/ui/skeleton"

export function NewMilestone() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-44 rounded-md" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardFooter>
    </Card>
  )
}
