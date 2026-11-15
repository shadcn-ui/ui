"use client"

import * as React from "react"
import { CartesianGrid, Line, Rectangle, XAxis, YAxis } from "recharts"
import type { BarShapeProps } from "recharts/types/cartesian/Bar"

import {
  CandlestickChart,
  CandlestickTooltipContent,
  getCandlestickDomain,
  type CandlestickDatum,
} from "@/registry/new-york-v4/ui/candlestick-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { ChartTooltip, type ChartConfig } from "@/registry/new-york-v4/ui/chart"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york-v4/ui/toggle-group"

export const description = "An advanced candlestick chart"

const chartData: (CandlestickDatum & { date: string })[] = [
  { date: "2024-04-01", open: 200, high: 202, low: 191, close: 197 },
  { date: "2024-04-02", open: 197, high: 201, low: 192, close: 193 },
  { date: "2024-04-03", open: 193, high: 195, low: 184, close: 193 },
  { date: "2024-04-04", open: 193, high: 211, low: 188, close: 202 },
  { date: "2024-04-05", open: 202, high: 214, low: 196, close: 205 },
  { date: "2024-04-06", open: 205, high: 207, low: 189, close: 199 },
  { date: "2024-04-07", open: 199, high: 215, low: 193, close: 206 },
  { date: "2024-04-08", open: 206, high: 212, low: 199, close: 202 },
  { date: "2024-04-09", open: 202, high: 218, low: 200, close: 210 },
  { date: "2024-04-10", open: 210, high: 221, low: 208, close: 216 },
  { date: "2024-04-11", open: 216, high: 222, low: 201, close: 209 },
  { date: "2024-04-12", open: 209, high: 222, low: 205, close: 215 },
  { date: "2024-04-13", open: 215, high: 224, low: 208, close: 217 },
  { date: "2024-04-14", open: 217, high: 231, low: 212, close: 221 },
  { date: "2024-04-15", open: 221, high: 224, low: 210, close: 215 },
  { date: "2024-04-16", open: 215, high: 223, low: 204, close: 210 },
  { date: "2024-04-17", open: 210, high: 221, low: 207, close: 216 },
  { date: "2024-04-18", open: 216, high: 217, low: 209, close: 213 },
  { date: "2024-04-19", open: 213, high: 222, low: 201, close: 211 },
  { date: "2024-04-20", open: 211, high: 220, low: 201, close: 207 },
  { date: "2024-04-21", open: 207, high: 211, low: 203, close: 205 },
  { date: "2024-04-22", open: 205, high: 215, low: 196, close: 213 },
  { date: "2024-04-23", open: 213, high: 224, low: 206, close: 219 },
  { date: "2024-04-24", open: 219, high: 221, low: 211, close: 217 },
  { date: "2024-04-25", open: 217, high: 220, low: 206, close: 212 },
  { date: "2024-04-26", open: 212, high: 221, low: 209, close: 216 },
  { date: "2024-04-27", open: 216, high: 223, low: 203, close: 212 },
  { date: "2024-04-28", open: 212, high: 225, low: 203, close: 218 },
  { date: "2024-04-29", open: 218, high: 220, low: 215, close: 217 },
  { date: "2024-04-30", open: 217, high: 225, low: 207, close: 218 },
  { date: "2024-05-01", open: 218, high: 226, low: 212, close: 217 },
  { date: "2024-05-02", open: 217, high: 219, low: 202, close: 210 },
  { date: "2024-05-03", open: 210, high: 226, low: 207, close: 218 },
  { date: "2024-05-04", open: 218, high: 222, low: 212, close: 217 },
  { date: "2024-05-05", open: 217, high: 232, low: 214, close: 223 },
  { date: "2024-05-06", open: 223, high: 229, low: 218, close: 221 },
  { date: "2024-05-07", open: 221, high: 222, low: 213, close: 220 },
  { date: "2024-05-08", open: 220, high: 225, low: 216, close: 219 },
  { date: "2024-05-09", open: 219, high: 228, low: 213, close: 221 },
  { date: "2024-05-10", open: 221, high: 226, low: 217, close: 223 },
  { date: "2024-05-11", open: 223, high: 232, low: 219, close: 222 },
  { date: "2024-05-12", open: 222, high: 239, low: 216, close: 229 },
  { date: "2024-05-13", open: 229, high: 237, low: 226, close: 236 },
  { date: "2024-05-14", open: 236, high: 243, low: 226, close: 237 },
  { date: "2024-05-15", open: 237, high: 252, low: 229, close: 245 },
  { date: "2024-05-16", open: 245, high: 251, low: 236, close: 243 },
  { date: "2024-05-17", open: 243, high: 247, low: 231, close: 236 },
  { date: "2024-05-18", open: 236, high: 251, low: 235, close: 241 },
  { date: "2024-05-19", open: 241, high: 247, low: 234, close: 243 },
  { date: "2024-05-20", open: 243, high: 251, low: 240, close: 246 },
  { date: "2024-05-21", open: 246, high: 256, low: 245, close: 250 },
  { date: "2024-05-22", open: 250, high: 264, low: 241, close: 256 },
  { date: "2024-05-23", open: 256, high: 266, low: 246, close: 260 },
  { date: "2024-05-24", open: 260, high: 275, low: 252, close: 268 },
  { date: "2024-05-25", open: 268, high: 274, low: 255, close: 262 },
  { date: "2024-05-26", open: 262, high: 270, low: 258, close: 259 },
  { date: "2024-05-27", open: 259, high: 272, low: 255, close: 267 },
  { date: "2024-05-28", open: 267, high: 275, low: 266, close: 269 },
  { date: "2024-05-29", open: 269, high: 275, low: 266, close: 268 },
  { date: "2024-05-30", open: 268, high: 270, low: 260, close: 263 },
  { date: "2024-05-31", open: 263, high: 269, low: 255, close: 260 },
  { date: "2024-06-01", open: 260, high: 275, low: 254, close: 268 },
  { date: "2024-06-02", open: 268, high: 275, low: 262, close: 266 },
  { date: "2024-06-03", open: 266, high: 282, low: 260, close: 273 },
  { date: "2024-06-04", open: 273, high: 284, low: 267, close: 276 },
  { date: "2024-06-05", open: 276, high: 278, low: 270, close: 273 },
  { date: "2024-06-06", open: 273, high: 277, low: 262, close: 267 },
  { date: "2024-06-07", open: 267, high: 279, low: 259, close: 272 },
  { date: "2024-06-08", open: 272, high: 279, low: 264, close: 269 },
  { date: "2024-06-09", open: 269, high: 277, low: 261, close: 267 },
  { date: "2024-06-10", open: 267, high: 279, low: 264, close: 272 },
  { date: "2024-06-11", open: 272, high: 287, low: 264, close: 277 },
  { date: "2024-06-12", open: 277, high: 286, low: 271, close: 284 },
  { date: "2024-06-13", open: 284, high: 292, low: 283, close: 285 },
  { date: "2024-06-14", open: 285, high: 286, low: 277, close: 285 },
  { date: "2024-06-15", open: 285, high: 289, low: 271, close: 281 },
  { date: "2024-06-16", open: 281, high: 290, low: 279, close: 284 },
  { date: "2024-06-17", open: 284, high: 291, low: 275, close: 285 },
  { date: "2024-06-18", open: 285, high: 287, low: 272, close: 280 },
  { date: "2024-06-19", open: 280, high: 296, low: 278, close: 288 },
  { date: "2024-06-20", open: 288, high: 296, low: 275, close: 284 },
  { date: "2024-06-21", open: 284, high: 300, low: 282, close: 291 },
  { date: "2024-06-22", open: 291, high: 304, low: 284, close: 295 },
  { date: "2024-06-23", open: 295, high: 306, low: 287, close: 297 },
  { date: "2024-06-24", open: 297, high: 307, low: 289, close: 302 },
  { date: "2024-06-25", open: 302, high: 307, low: 292, close: 298 },
  { date: "2024-06-26", open: 298, high: 300, low: 289, close: 294 },
  { date: "2024-06-27", open: 294, high: 302, low: 282, close: 289 },
  { date: "2024-06-28", open: 289, high: 292, low: 283, close: 285 },
  { date: "2024-06-29", open: 285, high: 301, low: 280, close: 291 },
  { date: "2024-06-30", open: 291, high: 293, low: 289, close: 291 },
]

const SMA_PERIOD = 7

// A simple moving average of the close price, added to every row.
const chartDataWithSma = chartData.map((item, index) => {
  const window = chartData.slice(Math.max(0, index - SMA_PERIOD + 1), index + 1)

  return {
    ...item,
    sma:
      window.length === SMA_PERIOD
        ? window.reduce((sum, row) => sum + row.close, 0) / SMA_PERIOD
        : null,
  }
})

// `up` and `down` come from CandlestickChart. Add your own series here.
const chartConfig = {
  sma: {
    label: "SMA 7",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

// Your own candle body: a hollow rectangle instead of a filled one.
function HollowCandle(props: BarShapeProps) {
  const { open, close } = props.payload as CandlestickDatum

  return (
    <Rectangle
      {...props}
      fill="var(--card)"
      stroke={close >= open ? "var(--color-up)" : "var(--color-down)"}
      strokeWidth={1.5}
    />
  )
}

export function ChartCandlestickAdvanced() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [candleStyle, setCandleStyle] = React.useState("filled")
  const [showSma, setShowSma] = React.useState(false)

  const filteredData = chartDataWithSma.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-col gap-4 space-y-0 border-b py-5 sm:flex-row sm:items-center">
        <div className="grid flex-1 gap-1">
          <CardTitle>Candlestick Chart - Advanced</CardTitle>
          <CardDescription>
            A custom toolbar, candle shape and moving average
          </CardDescription>
        </div>
        {/* The toolbar is yours to build. CandlestickChart does not include one. */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="candlestick-sma"
              checked={showSma}
              onCheckedChange={setShowSma}
            />
            <Label htmlFor="candlestick-sma">SMA 7</Label>
          </div>
          <ToggleGroup
            type="single"
            variant="outline"
            value={candleStyle}
            onValueChange={(value) => value && setCandleStyle(value)}
          >
            <ToggleGroupItem value="filled" aria-label="Filled candles">
              Filled
            </ToggleGroupItem>
            <ToggleGroupItem value="hollow" aria-label="Hollow candles">
              Hollow
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label="Select a time range"
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
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <CandlestickChart
          data={filteredData}
          config={chartConfig}
          shape={candleStyle === "hollow" ? HollowCandle : undefined}
          className="aspect-auto h-[300px] w-full"
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis
            width={40}
            tickLine={false}
            axisLine={false}
            domain={getCandlestickDomain(filteredData)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <CandlestickTooltipContent
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }
              />
            }
          />
          {showSma && (
            <Line
              name="SMA 7"
              dataKey="sma"
              type="monotone"
              stroke="var(--color-sma)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          )}
        </CandlestickChart>
      </CardContent>
    </Card>
  )
}
