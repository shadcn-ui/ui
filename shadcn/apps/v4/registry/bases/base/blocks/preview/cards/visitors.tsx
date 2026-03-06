"use client"

import { Area, AreaChart, XAxis } from "recharts"

import { Badge } from "@/registry/bases/base/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/bases/base/ui/chart"

const areaChartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const areaChartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const latestVisitors = areaChartData[areaChartData.length - 1]?.desktop ?? 0
const previousVisitors =
  areaChartData[areaChartData.length - 2]?.desktop ?? latestVisitors
const trendPercent =
  previousVisitors === 0
    ? 0
    : Math.round(((latestVisitors - previousVisitors) / previousVisitors) * 100)
const trendPrefix = trendPercent > 0 ? "+" : ""

export function Visitors() {
  return (
    <Card className="pb-0">
      <CardHeader>
        <CardTitle>Visitors</CardTitle>
        <CardDescription>Last 6 months </CardDescription>
        <CardAction>
          <Badge variant={trendPercent >= 0 ? "secondary" : "destructive"}>
            {trendPrefix}
            {trendPercent}% vs last month
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <ChartContainer config={areaChartConfig} className="h-48 w-full">
          <AreaChart
            accessibilityLayer
            data={areaChartData}
            margin={{ left: 0, right: 0, top: 6, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              hide
              axisLine={false}
              tickMargin={6}
              tickFormatter={(value) => String(value).slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.15}
              stroke="var(--color-desktop)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
