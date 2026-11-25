"use client"

import { TrendingUp } from "lucide-react"

import { CandlestickChart } from "@/registry/new-york-v4/ui/candlestick-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"

export const description = "A candlestick chart"

const chartData = [
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

export function ChartCandlestickDefault() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candlestick Chart</CardTitle>
        <CardDescription>June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <CandlestickChart data={chartData} />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 11.9% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing open, high, low and close for June 2024
        </div>
      </CardFooter>
    </Card>
  )
}
