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
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    colors: {
      light: "#3b82f6",
      dark: "#f43f5e",
    },
  },
  safari: {
    label: "Safari",
    colors: {
      light: "#60a5fa",
      dark: "#fb7185",
    },
  },
  firefox: {
    label: "Firefox",
    colors: {
      light: "#93c5fd",
      dark: "#fda4af",
    },
  },
  edge: {
    label: "Edge",
    colors: {
      light: "#bfdbfe",
      dark: "#fecdd3",
    },
  },
  other: {
    label: "Other",
    colors: {
      light: "#dbeafe",
      dark: "#ffe4e6",
    },
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
