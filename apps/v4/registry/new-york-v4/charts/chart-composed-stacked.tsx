"use client"

import { TrendingUp } from "lucide-react"
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

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
  "A composed chart with stacked bars and a total trend line"

const chartData = [
  { month: "January", direct: 1800, organic: 2400, paid: 900, total: 5100 },
  { month: "February", direct: 2200, organic: 3100, paid: 1400, total: 6700 },
  { month: "March", direct: 1900, organic: 2800, paid: 1700, total: 6400 },
  { month: "April", direct: 2800, organic: 4200, paid: 2100, total: 9100 },
  { month: "May", direct: 2400, organic: 3800, paid: 2600, total: 8800 },
  { month: "June", direct: 3100, organic: 5300, paid: 3200, total: 11600 },
]

const chartConfig = {
  direct: {
    label: "Direct",
    color: "var(--chart-1)",
  },
  organic: {
    label: "Organic",
    color: "var(--chart-2)",
  },
  paid: {
    label: "Paid",
    color: "var(--chart-3)",
  },
  total: {
    label: "Total",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartComposedStacked() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic by Channel</CardTitle>
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
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="direct"
              stackId="channels"
              fill="var(--color-direct)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="organic"
              stackId="channels"
              fill="var(--color-organic)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="paid"
              stackId="channels"
              fill="var(--color-paid)"
              radius={[4, 4, 0, 0]}
            />
            <Line
              dataKey="total"
              type="natural"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={{ fill: "var(--color-total)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total visits up 127% to 11.6k <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Stacked bars by channel with total trend line overlay
        </div>
      </CardFooter>
    </Card>
  )
}
