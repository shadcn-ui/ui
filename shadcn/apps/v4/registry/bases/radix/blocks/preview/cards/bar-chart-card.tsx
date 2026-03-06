"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/bases/radix/ui/chart"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/radix/ui/toggle-group"

const barChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const barChartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const desktopTotal = barChartData.reduce((sum, item) => sum + item.desktop, 0)
const mobileTotal = barChartData.reduce((sum, item) => sum + item.mobile, 0)
const desktopDelta = Math.round(
  ((desktopTotal - mobileTotal) / mobileTotal) * 100
)
const desktopDeltaPrefix = desktopDelta > 0 ? "+" : ""

export function BarChartCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Channels</CardTitle>
        <CardDescription>
          Desktop vs mobile over the last 6 months
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            aria-label="Time range"
            defaultValue="6m"
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="6m">6M</ToggleGroupItem>
            <ToggleGroupItem value="12m">12M</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer
          config={barChartConfig}
          className="max-h-[180px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={barChartData}
            margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tickFormatter={(value) => String(value).slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="desktop"
              fill="var(--color-desktop)"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="mobile"
              fill="var(--color-mobile)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="grid w-full grid-cols-3 divide-x divide-border/60">
          <div className="px-2 text-center">
            <div className="text-[0.65rem] text-muted-foreground uppercase">
              Desktop
            </div>
            <div className="text-sm font-medium tabular-nums">
              {desktopTotal.toLocaleString()}
            </div>
          </div>
          <div className="px-2 text-center">
            <div className="text-[0.65rem] text-muted-foreground uppercase">
              Mobile
            </div>
            <div className="text-sm font-medium tabular-nums">
              {mobileTotal.toLocaleString()}
            </div>
          </div>
          <div className="px-2 text-center">
            <div className="text-[0.65rem] text-muted-foreground uppercase">
              Mix Delta
            </div>
            <div className="text-sm font-medium tabular-nums">
              {desktopDeltaPrefix}
              {desktopDelta}%
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
