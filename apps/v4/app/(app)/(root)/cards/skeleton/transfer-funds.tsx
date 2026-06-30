import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/styles/base-rhea/ui/card"
import { Skeleton } from "@/styles/base-rhea/ui/skeleton"

export function TransferFunds() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-36 rounded-md" />
        <Skeleton className="h-4 w-64 rounded-md" />
        <CardAction>
          <Skeleton className="size-8 rounded-md" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-32 rounded-md" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-3 rounded-xl bg-muted p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-24 rounded-md bg-muted-foreground/15" />
          </div>
          <Skeleton className="h-px w-full rounded-none bg-muted-foreground/15" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-12 rounded-md bg-muted-foreground/15" />
          </div>
          <Skeleton className="h-px w-full rounded-none bg-muted-foreground/15" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-20 rounded-md bg-muted-foreground/15" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardFooter>
    </Card>
  )
}
