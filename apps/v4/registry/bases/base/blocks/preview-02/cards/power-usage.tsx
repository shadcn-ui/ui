"use client"

import { Bar, BarChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/bases/base/ui/chart"
import { Progress } from "@/registry/bases/base/ui/progress"
import { Separator } from "@/registry/bases/base/ui/separator"

const chartData = [
  { hour: "6a", usage: 1.2 },
  { hour: "8a", usage: 2.8 },
  { hour: "10a", usage: 3.1 },
  { hour: "12p", usage: 2.4 },
  { hour: "2p", usage: 3.4 },
  { hour: "4p", usage: 2.9 },
  { hour: "6p", usage: 3.8 },
  { hour: "8p", usage: 3.2 },
]

const chartConfig = {
  usage: {
    label: "Usage (kW)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function PowerUsage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Power Usage</CardTitle>
        <CardDescription>Whole Home</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ChartContainer config={chartConfig} className="h-[140px] w-full">
          <BarChart
            data={chartData}
            margin={{ left: 0, right: 0, top: 4, bottom: 0 }}
          >
            <XAxis
              dataKey="hour"
              tickLine={false}
              tickMargin={6}
              axisLine={false}
              className="text-xs"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="usage"
              fill="var(--color-usage)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">
              Currently Using
            </span>
            <span className="text-lg font-semibold tabular-nums">3.4 kW</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">Solar Gen</span>
            <span className="text-lg font-semibold text-chart-1 tabular-nums">
              +1.2 kW
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1">
        <span className="text-sm text-muted-foreground">Battery Level</span>
        <div className="flex w-full items-center gap-2">
          <Progress value={85} className="flex-1" />
          <span className="text-sm font-medium tabular-nums">85%</span>
        </div>
      </CardFooter>
    </Card>
  )
}
