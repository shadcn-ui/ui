import { Card, CardContent, CardHeader } from "@/styles/base-rhea/ui/card"
import { Skeleton } from "@/styles/base-rhea/ui/skeleton"

const rows = [0, 1, 2]

export function Payments() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="size-1.5 rounded-full" />
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="size-1.5 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <div
              key={row}
              className="flex items-center gap-3 rounded-xl bg-muted p-3"
            >
              <Skeleton className="size-9 rounded-lg bg-muted-foreground/15" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-40 rounded-md bg-muted-foreground/15" />
                <Skeleton className="h-3 w-56 rounded-md bg-muted-foreground/15" />
              </div>
              <Skeleton className="size-4 rounded-md bg-muted-foreground/15" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
