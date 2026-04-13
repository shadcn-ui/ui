"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/styles/base-sera/ui/chart"

const CHART_DATA = [
  { month: "Jan", articles: 12, features: 8 },
  { month: "Feb", articles: 8, features: 5 },
  { month: "Mar", articles: 15, features: 11 },
  { month: "Apr", articles: 10, features: 7 },
  { month: "May", articles: 18, features: 14 },
  { month: "Jun", articles: 14, features: 9 },
]

const CHART_CONFIG = {
  articles: {
    label: "Articles",
    theme: {
      light: "var(--chart-5)",
      dark: "var(--chart-1)",
    },
  },
  features: {
    label: "Features",
    theme: {
      light: "var(--chart-1)",
      dark: "var(--chart-2)",
    },
  },
} satisfies ChartConfig

export function ChartCard() {
  return (
    <Card className="col-span-full md:col-span-6 lg:col-span-5">
      <CardHeader className="border-b">
        <CardTitle>Bar Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={CHART_CONFIG} className="h-48 w-full">
          <BarChart data={CHART_DATA}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 6"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="articles" fill="var(--color-articles)" radius={0} />
            <Bar dataKey="features" fill="var(--color-features)" radius={0} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
