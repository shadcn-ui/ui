"use client"

import { TrendingUp } from "lucide-react"
import {
  CartesianGrid,
  LabelList,
  Scatter,
  ScatterChart,
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

export const description = "A scatter chart with labels"

const chartData = [
  { x: 10, y: 20, label: "A" },
  { x: 30, y: 45, label: "B" },
  { x: 50, y: 28, label: "C" },
  { x: 70, y: 60, label: "D" },
  { x: 90, y: 82, label: "E" },
  { x: 110, y: 55, label: "F" },
  { x: 130, y: 72, label: "G" },
]

const chartConfig = {
  x: {
    label: "X Value",
    color: "var(--chart-1)",
  },
  y: {
    label: "Y Value",
  },
} satisfies ChartConfig

export function ChartScatterLabel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Chart - Label</CardTitle>
        <CardDescription>With data point labels</CardDescription>
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
            <Scatter data={chartData} fill="var(--color-x)" shape="circle">
              <LabelList
                dataKey="label"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Scatter>
          </ScatterChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Labels help identify individual data points{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Each point is labeled for easy identification
        </div>
      </CardFooter>
    </Card>
  )
}
