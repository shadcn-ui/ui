"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/styles/base-sera/ui/chart"

const CHART_DATA = [
  { month: "Jan", pageviews: 2400, unique: 1800 },
  { month: "Feb", pageviews: 1800, unique: 1200 },
  { month: "Mar", pageviews: 3200, unique: 2400 },
  { month: "Apr", pageviews: 2800, unique: 2000 },
  { month: "May", pageviews: 4200, unique: 3100 },
  { month: "Jun", pageviews: 3600, unique: 2700 },
]

const CHART_CONFIG = {
  pageviews: {
    label: "Pageviews",
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

export function LineChartCard() {
  return (
    <Card className="col-span-full md:col-span-6 lg:col-span-5">
      <CardHeader className="border-b">
        <CardTitle>Line Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={CHART_CONFIG} className="h-48 w-full">
          <LineChart data={CHART_DATA}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 6"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="pageviews"
              stroke="var(--color-pageviews)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="unique"
              stroke="var(--color-unique)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
