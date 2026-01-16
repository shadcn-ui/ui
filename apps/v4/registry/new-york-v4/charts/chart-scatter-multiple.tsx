"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts"

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

export const description = "A scatter chart with multiple datasets"

const chartDataDesktop = [
  { x: 10, y: 20 },
  { x: 30, y: 45 },
  { x: 50, y: 28 },
  { x: 70, y: 60 },
  { x: 90, y: 82 },
  { x: 110, y: 55 },
  { x: 130, y: 72 },
]

const chartDataMobile = [
  { x: 15, y: 35 },
  { x: 35, y: 52 },
  { x: 55, y: 38 },
  { x: 75, y: 68 },
  { x: 95, y: 90 },
  { x: 115, y: 62 },
  { x: 135, y: 80 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
    icon: () => (
      <svg viewBox="0 0 12 12" className="h-3 w-3">
        <circle cx="6" cy="6" r="5" fill="var(--chart-1)" />
      </svg>
    ),
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
    icon: () => (
      <svg viewBox="0 0 12 12" className="h-3 w-3">
        <path d="M6 1 L11 11 L1 11 Z" fill="var(--chart-2)" />
      </svg>
    ),
  },
} satisfies ChartConfig

export function ChartScatterMultiple() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Chart - Multiple</CardTitle>
        <CardDescription>Comparing two datasets</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ScatterChart
            accessibilityLayer
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="X Value"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Y Value"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<ChartTooltipContent />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Scatter
              data={chartDataDesktop}
              fill="var(--color-desktop)"
              name="desktop"
              shape="circle"
            />
            <Scatter
              data={chartDataMobile}
              fill="var(--color-mobile)"
              name="mobile"
              shape="triangle"
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Desktop shows higher correlation <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Comparing desktop vs mobile data patterns
        </div>
      </CardFooter>
    </Card>
  )
}
