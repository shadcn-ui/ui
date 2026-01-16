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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

export const description = "A bubble chart with three dimensions"

const chartData = [
  { x: 10, y: 20, z: 200 },
  { x: 30, y: 45, z: 300 },
  { x: 50, y: 28, z: 150 },
  { x: 70, y: 60, z: 400 },
  { x: 90, y: 82, z: 500 },
  { x: 110, y: 55, z: 250 },
  { x: 130, y: 72, z: 350 },
  { x: 150, y: 95, z: 600 },
]

const chartConfig = {
  x: {
    label: "X Value",
    color: "var(--chart-1)",
  },
  y: {
    label: "Y Value",
  },
  z: {
    label: "Size",
  },
} satisfies ChartConfig

export function ChartScatterBubble() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bubble Chart</CardTitle>
        <CardDescription>
          Showing three-dimensional data relationships
        </CardDescription>
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
            <ZAxis type="number" dataKey="z" range={[50, 250]} name="Size" />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<ChartTooltipContent />}
            />
            <Scatter data={chartData} fill="var(--color-x)" shape="circle" />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Bubble size represents the third dimension{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Displaying three-dimensional data in a two-dimensional chart
        </div>
      </CardFooter>
    </Card>
  )
}
