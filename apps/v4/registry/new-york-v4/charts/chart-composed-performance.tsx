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

export const description =
  "A composed chart with traffic area, conversions bars and conversion rate line"

const chartData = [
  { month: "January", traffic: 12400, conversions: 310, rate: 2.5 },
  { month: "February", traffic: 18900, conversions: 567, rate: 3.0 },
  { month: "March", traffic: 16200, conversions: 583, rate: 3.6 },
  { month: "April", traffic: 24700, conversions: 1111, rate: 4.5 },
  { month: "May", traffic: 21300, conversions: 1065, rate: 5.0 },
  { month: "June", traffic: 31600, conversions: 1896, rate: 6.0 },
]

const chartConfig = {
  traffic: {
    label: "Page Traffic",
    color: "var(--chart-1)",
  },
  conversions: {
    label: "Conversions",
    color: "var(--chart-2)",
  },
  rate: {
    label: "Conv. Rate %",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export function ChartComposedPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Performance</CardTitle>
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
              yAxisId="visits"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="rate"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              yAxisId="visits"
              dataKey="traffic"
              type="natural"
              fill="var(--color-traffic)"
              fillOpacity={0.15}
              stroke="var(--color-traffic)"
              strokeWidth={2}
            />
            <Bar
              yAxisId="visits"
              dataKey="conversions"
              fill="var(--color-conversions)"
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
            <Line
              yAxisId="rate"
              dataKey="rate"
              type="natural"
              stroke="var(--color-rate)"
              strokeWidth={2}
              dot={{ fill: "var(--color-rate)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Conversion rate doubled to 6% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Traffic (area), conversions (bars), conversion rate % (line)
        </div>
      </CardFooter>
    </Card>
  )
}
