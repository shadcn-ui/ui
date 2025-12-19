"use client"

import { TrendingUp } from "lucide-react"
import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
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

export const description = "A bubble chart with multiple datasets and legend"

const chartDataA = [
  { x: 150, y: 220, z: 180 },
  { x: 200, y: 280, z: 220 },
  { x: 250, y: 320, z: 200 },
  { x: 180, y: 350, z: 240 },
]

const chartDataB = [
  { x: 350, y: 180, z: 160 },
  { x: 400, y: 240, z: 190 },
  { x: 450, y: 200, z: 210 },
  { x: 380, y: 280, z: 180 },
]

const chartDataC = [
  { x: 280, y: 450, z: 250 },
  { x: 350, y: 520, z: 280 },
  { x: 420, y: 480, z: 260 },
  { x: 320, y: 580, z: 300 },
]

const chartConfig = {
  seriesA: {
    label: "Product A",
    color: "var(--chart-1)",
    icon: () => (
      <svg viewBox="0 0 12 12" className="h-3 w-3">
        <circle cx="6" cy="6" r="5" fill="var(--chart-1)" />
      </svg>
    ),
  },
  seriesB: {
    label: "Product B",
    color: "var(--chart-2)",
    icon: () => (
      <svg viewBox="0 0 12 12" className="h-3 w-3">
        <path d="M6 1 L11 11 L1 11 Z" fill="var(--chart-2)" />
      </svg>
    ),
  },
  seriesC: {
    label: "Product C",
    color: "var(--chart-3)",
    icon: () => (
      <svg viewBox="0 0 12 12" className="h-3 w-3">
        <path d="M6 1 L10 6 L6 11 L2 6 Z" fill="var(--chart-3)" />
      </svg>
    ),
  },
} satisfies ChartConfig

export function ChartScatterLegend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bubble Chart - Legend</CardTitle>
        <CardDescription>Product performance comparison</CardDescription>
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
              name="Sales Volume"
              domain={[100, 500]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Revenue"
              domain={[100, 650]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ZAxis
              type="number"
              dataKey="z"
              range={[30, 120]}
              name="Market Share"
            />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<ChartTooltipContent />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Scatter
              data={chartDataA}
              fill="var(--color-seriesA)"
              name="seriesA"
              shape="circle"
            />
            <Scatter
              data={chartDataB}
              fill="var(--color-seriesB)"
              name="seriesB"
              shape="triangle"
            />
            <Scatter
              data={chartDataC}
              fill="var(--color-seriesC)"
              name="seriesC"
              shape="diamond"
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Three product categories analyzed <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Bubble size represents market share percentage
        </div>
      </CardFooter>
    </Card>
  )
}
