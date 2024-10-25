"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/default/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select"

export const description = "An interactive area chart"

const chartData = [
  { desktop: 222, mobile: 150 },
  { desktop: 97, mobile: 180 },
  { desktop: 167, mobile: 120 },
  { desktop: 242, mobile: 260 },
  { desktop: 373, mobile: 290 },
  { desktop: 301, mobile: 340 },
  { desktop: 245, mobile: 180 },
  { desktop: 409, mobile: 320 },
  { desktop: 59, mobile: 110 },
  { desktop: 261, mobile: 190 },
  { desktop: 327, mobile: 350 },
  { desktop: 292, mobile: 210 },
  { desktop: 342, mobile: 380 },
  { desktop: 137, mobile: 220 },
  { desktop: 120, mobile: 170 },
  { desktop: 138, mobile: 190 },
  { desktop: 446, mobile: 360 },
  { desktop: 364, mobile: 410 },
  { desktop: 243, mobile: 180 },
  { desktop: 89, mobile: 150 },
  { desktop: 137, mobile: 200 },
  { desktop: 224, mobile: 170 },
  { desktop: 138, mobile: 230 },
  { desktop: 387, mobile: 290 },
  { desktop: 215, mobile: 250 },
  { desktop: 75, mobile: 130 },
  { desktop: 383, mobile: 420 },
  { desktop: 122, mobile: 180 },
  { desktop: 315, mobile: 240 },
  { desktop: 454, mobile: 380 },
  { desktop: 165, mobile: 220 },
  { desktop: 293, mobile: 310 },
  { desktop: 247, mobile: 190 },
  { desktop: 385, mobile: 420 },
  { desktop: 481, mobile: 390 },
  { desktop: 498, mobile: 520 },
  { desktop: 388, mobile: 300 },
  { desktop: 149, mobile: 210 },
  { desktop: 227, mobile: 180 },
  { desktop: 293, mobile: 330 },
  { desktop: 335, mobile: 270 },
  { desktop: 197, mobile: 240 },
  { desktop: 197, mobile: 160 },
  { desktop: 448, mobile: 490 },
  { desktop: 473, mobile: 380 },
  { desktop: 338, mobile: 400 },
  { desktop: 499, mobile: 420 },
  { desktop: 315, mobile: 350 },
  { desktop: 235, mobile: 180 },
  { desktop: 177, mobile: 230 },
  { desktop: 82, mobile: 140 },
  { desktop: 81, mobile: 120 },
  { desktop: 252, mobile: 290 },
  { desktop: 294, mobile: 220 },
  { desktop: 201, mobile: 250 },
  { desktop: 213, mobile: 170 },
  { desktop: 420, mobile: 460 },
  { desktop: 233, mobile: 190 },
  { desktop: 78, mobile: 130 },
  { desktop: 340, mobile: 280 },
  { desktop: 178, mobile: 230 },
  { desktop: 178, mobile: 200 },
  { desktop: 470, mobile: 410 },
  { desktop: 103, mobile: 160 },
  { desktop: 439, mobile: 380 },
  { desktop: 88, mobile: 140 },
  { desktop: 294, mobile: 250 },
  { desktop: 323, mobile: 370 },
  { desktop: 385, mobile: 320 },
  { desktop: 438, mobile: 480 },
  { desktop: 155, mobile: 200 },
  { desktop: 92, mobile: 150 },
  { desktop: 492, mobile: 420 },
  { desktop: 81, mobile: 130 },
  { desktop: 426, mobile: 380 },
  { desktop: 307, mobile: 350 },
  { desktop: 371, mobile: 310 },
  { desktop: 475, mobile: 520 },
  { desktop: 107, mobile: 170 },
  { desktop: 341, mobile: 290 },
  { desktop: 408, mobile: 450 },
  { desktop: 169, mobile: 210 },
  { desktop: 317, mobile: 270 },
  { desktop: 480, mobile: 530 },
  { desktop: 132, mobile: 180 },
  { desktop: 141, mobile: 190 },
  { desktop: 434, mobile: 380 },
  { desktop: 448, mobile: 490 },
  { desktop: 149, mobile: 200 },
  { desktop: 103, mobile: 160 },
  { desktop: 446, mobile: 400 },
].map((entry, index) => {
  const today = new Date()
  const date = new Date(new Date().setDate(today.getDate() - index))
    .toISOString()
    .split("T")[0]

  return { ...entry, date }
})

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function Component() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    now.setDate(now.getDate() - daysToSubtract)
    return date >= now
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
