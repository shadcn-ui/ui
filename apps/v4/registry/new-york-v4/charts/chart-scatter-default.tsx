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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

export const description = "A scatter chart"

const chartData = [
  { x: 10, y: 20 },
  { x: 30, y: 45 },
  { x: 50, y: 28 },
  { x: 70, y: 60 },
  { x: 90, y: 82 },
  { x: 110, y: 55 },
  { x: 130, y: 72 },
  { x: 150, y: 95 },
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

export function ChartScatterDefault() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Chart</CardTitle>
        <CardDescription>
          Showing relationship between two variables
        </CardDescription>
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
            <Scatter data={chartData} fill="var(--color-x)" shape="circle" />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Showing positive correlation <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Displaying the relationship between X and Y values
        </div>
      </CardFooter>
    </Card>
  )
}
