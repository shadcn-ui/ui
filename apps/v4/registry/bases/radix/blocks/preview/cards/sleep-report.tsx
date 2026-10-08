"use client"

import { Bar, BarChart } from "recharts"

import { Badge } from "@/registry/bases/radix/ui/badge"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  ChartContainer,
  type ChartConfig,
} from "@/registry/bases/radix/ui/chart"

const sleepChartData = [
  { hour: "10pm", deep: 0, light: 30, rem: 0 },
  { hour: "11pm", deep: 20, light: 10, rem: 0 },
  { hour: "12am", deep: 40, light: 0, rem: 10 },
  { hour: "1am", deep: 30, light: 5, rem: 15 },
  { hour: "2am", deep: 10, light: 20, rem: 30 },
  { hour: "3am", deep: 25, light: 10, rem: 20 },
  { hour: "4am", deep: 15, light: 25, rem: 10 },
  { hour: "5am", deep: 5, light: 35, rem: 15 },
  { hour: "6am", deep: 0, light: 20, rem: 25 },
]

const sleepChartConfig = {
  deep: {
    label: "Deep",
    color: "var(--chart-1)",
  },
  light: {
    label: "Light",
    color: "var(--chart-2)",
  },
  rem: {
    label: "REM",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function SleepReport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sleep Report</CardTitle>
        <CardDescription>Last night · 7h 24m</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ChartContainer config={sleepChartConfig} className="h-32 w-full">
          <BarChart
            accessibilityLayer
            data={sleepChartData}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            barSize={16}
          >
            <Bar
              dataKey="deep"
              stackId="a"
              fill="var(--color-deep)"
              radius={0}
            />
            <Bar
              dataKey="light"
              stackId="a"
              fill="var(--color-light)"
              radius={0}
            />
            <Bar
              dataKey="rem"
              stackId="a"
              fill="var(--color-rem)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Deep", value: "2h 10m" },
            { label: "Light", value: "3h 48m" },
            { label: "REM", value: "1h 26m" },
            { label: "Score", value: "84" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-sm font-medium tabular-nums">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Badge variant="outline">Good</Badge>
        <Button variant="outline" size="sm" className="ml-auto">
          Details
        </Button>
      </CardFooter>
    </Card>
  )
}
