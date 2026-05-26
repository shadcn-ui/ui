import { Badge } from "@/styles/base-rhea/ui/badge"
import { Button } from "@/styles/base-rhea/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/styles/base-rhea/ui/card"
import { Item, ItemContent, ItemDescription } from "@/styles/base-rhea/ui/item"

const chartData = [
  { month: "Dec", amount: 800 },
  { month: "Jan", amount: 1100 },
  { month: "Feb", amount: 900 },
  { month: "Mar", amount: 1300 },
  { month: "Apr", amount: 750 },
  { month: "May", amount: 1400 },
]

export function ContributionHistory() {
  const maxAmount = Math.max(...chartData.map((item) => item.amount))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution History</CardTitle>
        <CardDescription>Last 6 months of activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="flex h-[200px] w-full items-end gap-3"
          role="img"
          aria-label="Last 6 months of contribution activity"
        >
          {chartData.map((item) => (
            <div
              key={item.month}
              className="flex h-full flex-1 flex-col justify-end gap-2"
            >
              <div
                className="min-h-2 rounded-t-md bg-chart-2"
                style={{ height: `${(item.amount / maxAmount) * 100}%` }}
              />
              <span className="text-center text-xs text-muted-foreground">
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardContent>
        <div className="grid w-full grid-cols-1 gap-3 xl:grid-cols-2">
          <Item variant="muted" className="flex-col items-stretch">
            <ItemContent className="gap-1">
              <ItemDescription className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Upcoming
              </ItemDescription>
              <span className="cn-font-heading text-base font-semibold">
                May 2024
              </span>
              <span className="text-sm text-muted-foreground">Scheduled</span>
            </ItemContent>
          </Item>
          <Item
            variant="muted"
            className="hidden flex-col items-stretch xl:flex"
          >
            <ItemContent className="gap-1">
              <ItemDescription className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Savings Plan
              </ItemDescription>
              <span className="cn-font-heading text-base font-semibold">
                Accelerated
              </span>
              <span className="text-sm text-muted-foreground">Recurring</span>
            </ItemContent>
          </Item>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Full Report</Button>
      </CardFooter>
    </Card>
  )
}
