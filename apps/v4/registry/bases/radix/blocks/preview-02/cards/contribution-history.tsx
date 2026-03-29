"use client"

import { Bar, BarChart, XAxis } from "recharts"

import { Badge } from "@/registry/bases/radix/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/bases/radix/ui/chart"

const chartData = [
  { month: "Dec", amount: 800 },
  { month: "Jan", amount: 1100 },
  { month: "Feb", amount: 900 },
  { month: "Mar", amount: 1300 },
  { month: "Apr", amount: 750 },
  { month: "May", amount: 1400 },
]

const chartConfig = {
  amount: {
    label: "Contribution",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ContributionHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution History</CardTitle>
        <CardDescription>Last 6 months of activity</CardDescription>
        <CardAction>
          <Badge variant="secondary">+12% vs last month</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="amount"
              fill="var(--color-amount)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-lg bg-muted p-4">
            <span className="text-xs tracking-wider text-muted-foreground uppercase">
              Upcoming
            </span>
            <span className="text-lg font-semibold">May 25, 2024</span>
            <span className="text-sm text-muted-foreground">
              $1,000 scheduled
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-muted p-4">
            <span className="text-xs tracking-wider text-muted-foreground uppercase">
              Auto-Save Plan
            </span>
            <span className="text-lg font-semibold">Accelerated</span>
            <span className="text-sm text-muted-foreground">
              Recurring weekly
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
