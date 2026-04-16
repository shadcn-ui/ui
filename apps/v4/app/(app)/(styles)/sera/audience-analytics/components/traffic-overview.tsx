"use client"

import { TrendingUpIcon } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/styles/base-sera/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/styles/base-sera/ui/chart"

const TRAFFIC_OVERVIEW_DATA = [
  { date: "2025-10-01", views: 2600, unique: 1600 },
  { date: "2025-10-04", views: 4500, unique: 3000 },
  { date: "2025-10-08", views: 3500, unique: 2500 },
  { date: "2025-10-10", views: 6400, unique: 4500 },
  { date: "2025-10-13", views: 5400, unique: 4000 },
  { date: "2025-10-15", views: 8300, unique: 6500 },
  { date: "2025-10-17", views: 7400, unique: 6000 },
  { date: "2025-10-18", views: 9240, unique: 7105 },
  { date: "2025-10-22", views: 7700, unique: 6400 },
  { date: "2025-10-26", views: 8800, unique: 7000 },
  { date: "2025-10-29", views: 9800, unique: 8400 },
]

const TRAFFIC_CHART_CONFIG = {
  views: {
    label: "Views",
    theme: {
      light: "var(--chart-5)",
      dark: "var(--chart-1)",
    },
  },
  unique: {
    label: "Unique",
    theme: {
      light: "var(--chart-1)",
      dark: "var(--chart-2)",
    },
  },
} satisfies ChartConfig

const X_AXIS_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
})

function formatYAxisTick(value: number) {
  if (value === 0) {
    return "0"
  }

  if (value % 1000 === 0) {
    return `${value / 1000}k`
  }

  return `${value / 1000}k`
}

function formatXAxisTick(value: string) {
  const date = new Date(`${value}T00:00:00Z`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return X_AXIS_DATE_FORMATTER.format(date)
}

export function TrafficOverview({
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-2xl">Traffic Overview</CardTitle>
        <CardDescription>
          Traffic for the last 30 days has increased by 12.4% compared to the
          previous period.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={TRAFFIC_CHART_CONFIG} className="h-82 w-full">
          <LineChart data={TRAFFIC_OVERVIEW_DATA}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 6"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tickMargin={10}
              tickFormatter={formatXAxisTick}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={44}
              domain={[0, 10000]}
              ticks={[0, 2500, 5000, 7500, 10000]}
              tickFormatter={formatYAxisTick}
              hide
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="linear"
              dataKey="views"
              stroke="var(--color-views)"
              strokeWidth={2.2}
              dot={false}
              activeDot={{ r: 3.5, fill: "var(--color-views)" }}
            />
            <Line
              type="linear"
              dataKey="unique"
              stroke="var(--color-unique)"
              strokeWidth={2}
              strokeDasharray="4 6"
              dot={false}
              activeDot={false}
            />
            <ReferenceDot
              x="2025-10-18"
              y={9240}
              r={2.5}
              fill="var(--color-views)"
              stroke="var(--color-views)"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
