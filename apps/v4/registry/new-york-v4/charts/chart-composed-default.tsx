"use client"

import { TrendingUp } from "lucide-react"
import {
  Area,
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

export const description = "A composed chart combining area, bar, and line"

const chartData = [
  { month: "January", visitors: 4200, signups: 240, retention: 62 },
  { month: "February", visitors: 5800, signups: 310, retention: 65 },
  { month: "March", visitors: 5200, signups: 280, retention: 59 },
  { month: "April", visitors: 7100, signups: 420, retention: 71 },
  { month: "May", visitors: 6400, signups: 390, retention: 68 },
  { month: "June", visitors: 8300, signups: 510, retention: 74 },
]

const chartConfig = {
  visitors: {
    label: "Total Visitors",
    color: "var(--chart-1)",
  },
  signups: {
    label: "New Signups",
    color: "var(--chart-2)",
  },
  retention: {
    label: "Retention %",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ChartComposedDefault() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Composed Chart</CardTitle>
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
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              yAxisId="left"
              dataKey="visitors"
              type="natural"
              fill="var(--color-visitors)"
              fillOpacity={0.2}
              stroke="var(--color-visitors)"
            />
            <Bar
              yAxisId="left"
              dataKey="signups"
              fill="var(--color-signups)"
              radius={4}
              barSize={32}
            />
            <Line
              yAxisId="right"
              dataKey="retention"
              type="natural"
              stroke="var(--color-retention)"
              strokeWidth={2}
              dot={{ fill: "var(--color-retention)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Retention up 12% over the period <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Visitors, signups, and retention rate — January through June 2024
        </div>
      </CardFooter>
    </Card>
  )
}
