import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/styles/base-rhea/ui/card"
import { Skeleton } from "@/styles/base-rhea/ui/skeleton"

const rows = [0, 1, 2, 3]
const miniBars = [40, 60, 80, 50]

export function DividendIncome() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-48 rounded-md" />
        <Skeleton className="h-4 w-64 rounded-md" />
        <CardAction>
          <Skeleton className="size-8 rounded-md" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <div
              key={row}
              className="flex items-center gap-3 rounded-xl bg-muted p-3"
            >
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-28 rounded-md bg-muted-foreground/15" />
                <Skeleton className="h-3 w-20 rounded-md bg-muted-foreground/15" />
              </div>
              <div className="hidden h-8 w-24 items-end gap-1 md:flex">
                {miniBars.map((h, i) => (
                  <Skeleton
                    key={i}
                    className="flex-1 rounded-t-sm rounded-b-none bg-muted-foreground/15"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <Skeleton className="hidden h-4 w-16 rounded-md bg-muted-foreground/15 md:block" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
