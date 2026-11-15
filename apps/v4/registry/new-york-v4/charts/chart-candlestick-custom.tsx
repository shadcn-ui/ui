"use client"

import { TrendingUp } from "lucide-react"
import type { BarShapeProps } from "recharts/types/cartesian/Bar"

import {
  CandlestickChart,
  type CandlestickDatum,
} from "@/registry/new-york-v4/ui/candlestick-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"

export const description = "A candlestick chart with a custom shape"

const chartData = [
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
]

// Your own candle drawn in SVG, here a rounded candle with a soft fill and a
// solid outline. The wick is drawn for you.
//
// `props` is the bar for the open to close range, so `y` is the higher of the
// two prices and `height` the distance between them. The row is in
// `props.payload`.
function RoundedCandle(props: BarShapeProps) {
  const { x, y, width, height } = props
  const { open, close } = props.payload as CandlestickDatum

  const color = close >= open ? "var(--color-up)" : "var(--color-down)"
  const bodyWidth = Math.min(width * 0.7, 14)
  // Keep a candle with almost no body visible.
  const bodyHeight = Math.max(height, 6)
  const bodyX = x + (width - bodyWidth) / 2
  const bodyY = y - (bodyHeight - height) / 2

  return (
    <g>
      {/* A solid backing, so the wick does not show through the soft fill. */}
      <rect
        x={bodyX}
        y={bodyY}
        width={bodyWidth}
        height={bodyHeight}
        rx={bodyWidth / 2}
        fill="var(--card)"
      />
      <rect
        x={bodyX}
        y={bodyY}
        width={bodyWidth}
        height={bodyHeight}
        rx={bodyWidth / 2}
        fill={color}
        fillOpacity={0.3}
        stroke={color}
        strokeWidth={2}
      />
    </g>
  )
}

export function ChartCandlestickCustom() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candlestick Chart - Custom Shape</CardTitle>
        <CardDescription>May 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <CandlestickChart data={chartData} shape={RoundedCandle} />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 19.8% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Rounded candles drawn with a custom shape for May 2024
        </div>
      </CardFooter>
    </Card>
  )
}
