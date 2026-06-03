import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/styles/base-rhea/ui/card"
import { Skeleton } from "@/styles/base-rhea/ui/skeleton"

export function AccountAccess() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-36 rounded-md" />
        <Skeleton className="h-4 w-64 rounded-md" />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-32 rounded-md" />
            <Skeleton className="h-3 w-12 rounded-md" />
          </div>
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </CardFooter>
    </Card>
  )
}
