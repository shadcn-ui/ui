"use client"

import { CloudRain } from "lucide-react"
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

export const description =
  "A composed chart with temperature area, rainfall bars and humidity line"

const chartData = [
  { month: "January", tempHigh: 48, rainfall: 3.8, humidity: 72 },
  { month: "February", tempHigh: 52, rainfall: 2.9, humidity: 68 },
  { month: "March", tempHigh: 61, rainfall: 4.1, humidity: 63 },
  { month: "April", tempHigh: 71, rainfall: 3.3, humidity: 58 },
  { month: "May", tempHigh: 80, rainfall: 1.4, humidity: 52 },
  { month: "June", tempHigh: 91, rainfall: 0.6, humidity: 44 },
]

const chartConfig = {
  tempHigh: {
    label: "High Temp (°F)",
    color: "var(--chart-4)",
  },
  rainfall: {
    label: "Rainfall (in)",
    color: "var(--chart-1)",
  },
  humidity: {
    label: "Humidity %",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ChartComposedWeather() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Overview</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              yAxisId="temp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}°`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              yAxisId="temp"
              dataKey="tempHigh"
              type="natural"
              fill="var(--color-tempHigh)"
              fillOpacity={0.25}
              stroke="var(--color-tempHigh)"
              strokeWidth={2}
            />
            <Bar
              yAxisId="right"
              dataKey="rainfall"
              fill="var(--color-rainfall)"
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
            <Line
              yAxisId="right"
              dataKey="humidity"
              type="natural"
              stroke="var(--color-humidity)"
              strokeWidth={2}
              dot={{ fill: "var(--color-humidity)", r: 4 }}
              activeDot={{ r: 6 }}
              strokeDasharray="5 4"
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Humidity drops as temperatures climb <CloudRain className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Temperature (area), rainfall (bars), humidity % (dashed line)
        </div>
      </CardFooter>
    </Card>
  )
}
