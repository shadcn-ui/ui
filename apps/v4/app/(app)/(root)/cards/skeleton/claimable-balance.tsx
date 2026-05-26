import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/styles/base-rhea/ui/card"
import { Skeleton } from "@/styles/base-rhea/ui/skeleton"

export function ClaimableBalance() {
  return (
    <Card>
      <CardHeader className="gap-3">
        <Skeleton className="h-4 w-36 rounded-md" />
        <Skeleton className="h-12 w-56 rounded-lg" />
        <Skeleton className="h-6 w-32 rounded-full" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-end">
        <div className="flex flex-col gap-3 rounded-xl bg-muted p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-20 rounded-md bg-muted-foreground/15" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-16 rounded-md bg-muted-foreground/15" />
          </div>
          <Skeleton className="h-px w-full rounded-none bg-muted-foreground/15" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-24 rounded-md bg-muted-foreground/15" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-11/12 rounded-md" />
        <Skeleton className="h-3 w-3/4 rounded-md" />
      </CardFooter>
    </Card>
  )
}
