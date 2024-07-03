"use client"

import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/registry/new-york/ui/chart"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--chart-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--chart-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--chart-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--chart-edge)" },
  { browser: "other", visitors: 90, fill: "var(--chart-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function Component() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="visitors">
              <LabelList
                dataKey="visitors"
                className="fill-background"
                stroke="none"
                fontSize={12}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
