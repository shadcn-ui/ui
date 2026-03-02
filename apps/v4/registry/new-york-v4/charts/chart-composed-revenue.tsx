"use client"

import { TrendingUp } from "lucide-react"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

export const description =
  "A composed chart with revenue, expenses bars and profit margin line"

const chartData = [
  { month: "January", revenue: 42000, expenses: 31000, margin: 26 },
  { month: "February", revenue: 58000, expenses: 34000, margin: 41 },
  { month: "March", revenue: 51000, expenses: 38000, margin: 25 },
  { month: "April", revenue: 74000, expenses: 39000, margin: 47 },
  { month: "May", revenue: 67000, expenses: 41000, margin: 39 },
  { month: "June", revenue: 89000, expenses: 43000, margin: 52 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-5)",
  },
  margin: {
    label: "Profit Margin %",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartComposedRevenue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue vs Expenses</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              yAxisId="dollars"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="percent"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              yAxisId="dollars"
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
            <Bar
              yAxisId="dollars"
              dataKey="expenses"
              fill="var(--color-expenses)"
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
            <Line
              yAxisId="percent"
              dataKey="margin"
              type="natural"
              stroke="var(--color-margin)"
              strokeWidth={2}
              dot={{ fill: "var(--color-margin)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Profit margin up to 52% in June <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Revenue and expenses (bars) with profit margin % overlay (line)
        </div>
      </CardFooter>
    </Card>
  )
}
