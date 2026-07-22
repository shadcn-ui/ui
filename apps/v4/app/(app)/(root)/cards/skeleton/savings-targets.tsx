import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/styles/base-rhea/ui/card"
import { Skeleton } from "@/styles/base-rhea/ui/skeleton"

const rows = [0, 1]

export function SavingsTargets() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-36 rounded-md" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-full max-w-64 rounded-md" />
          <Skeleton className="h-4 w-48 rounded-md" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div
              key={row}
              className="flex flex-col gap-3 rounded-xl bg-muted p-4"
            >
              <Skeleton className="h-3 w-24 rounded-md bg-muted-foreground/15" />
              <Skeleton className="h-8 w-36 rounded-md bg-muted-foreground/15" />
              <Skeleton className="h-2 w-full rounded-full bg-muted-foreground/15" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24 rounded-md bg-muted-foreground/15" />
                <Skeleton className="h-3 w-20 rounded-md bg-muted-foreground/15" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Skeleton className="h-3 w-56 rounded-md" />
      </CardFooter>
    </Card>
  )
}
