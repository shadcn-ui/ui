"use client"

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
  { hours: 1, score: 40 },
  { hours: 2, score: 48 },
  { hours: 3, score: 55 },
  { hours: 4, score: 61 },
  { hours: 5, score: 67 },
  { hours: 6, score: 74 },
  { hours: 7, score: 79 },
  { hours: 8, score: 85 },
]

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartScatterDefault() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Chart</CardTitle>
        <CardDescription>Study hours vs. test score</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <ScatterChart>
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="hours"
              name="Hours"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="number"
              dataKey="score"
              name="Score"
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<ChartTooltipContent />}
            />
            <Scatter
              name="Score"
              data={chartData}
              fill="var(--color-score)"
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Each point represents one student's study hours and test score.
        </div>
      </CardFooter>
    </Card>
  )
}