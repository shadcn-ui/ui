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

export const description = "A scatter chart with different shapes"

const chartDataA = [
  { x: 10, y: 30 },
  { x: 30, y: 50 },
  { x: 50, y: 35 },
  { x: 70, y: 65 },
  { x: 90, y: 80 },
]

const chartDataB = [
  { x: 20, y: 25 },
  { x: 40, y: 60 },
  { x: 60, y: 45 },
  { x: 80, y: 70 },
  { x: 100, y: 90 },
]

const chartDataC = [
  { x: 15, y: 40 },
  { x: 35, y: 30 },
  { x: 55, y: 55 },
  { x: 75, y: 50 },
  { x: 95, y: 75 },
]

const chartConfig = {
  categoryA: {
    label: "Category A",
    color: "var(--chart-1)",
    icon: () => (
      <svg viewBox="0 0 12 12" className="h-3 w-3">
        <circle cx="6" cy="6" r="5" fill="var(--chart-1)" />
      </svg>
    ),
  },
  categoryB: {
    label: "Category B",
    color: "var(--chart-2)",
    icon: () => (
      <svg viewBox="0 0 12 12" className="h-3 w-3">
        <path d="M6 1 L11 11 L1 11 Z" fill="var(--chart-2)" />
      </svg>
    ),
  },
  categoryC: {
    label: "Category C",
    color: "var(--chart-3)",
    icon: () => (
      <svg viewBox="0 0 12 12" className="h-3 w-3">
        <rect x="2" y="2" width="8" height="8" fill="var(--chart-3)" />
      </svg>
    ),
  },
} satisfies ChartConfig

export function ChartScatterShape() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Chart - Shapes</CardTitle>
        <CardDescription>Using different shapes for categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ScatterChart
            accessibilityLayer
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
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
              data={chartDataA}
              fill="var(--color-categoryA)"
              name="categoryA"
              shape="circle"
            />
            <Scatter
              data={chartDataB}
              fill="var(--color-categoryB)"
              name="categoryB"
              shape="triangle"
            />
            <Scatter
              data={chartDataC}
              fill="var(--color-categoryC)"
              name="categoryC"
              shape="square"
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Different shapes help distinguish categories{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Visualizing multiple categories with distinct markers
        </div>
      </CardFooter>
    </Card>
  )
}
