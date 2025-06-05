"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Calendar } from "@/registry/new-york-v4/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"

const chartData = [
  { date: "2025-06-01", visitors: 178 },
  { date: "2025-06-02", visitors: 470 },
  { date: "2025-06-03", visitors: 103 },
  { date: "2025-06-04", visitors: 439 },
  { date: "2025-06-05", visitors: 88 },
  { date: "2025-06-06", visitors: 294 },
  { date: "2025-06-07", visitors: 323 },
  { date: "2025-06-08", visitors: 385 },
  { date: "2025-06-09", visitors: 438 },
  { date: "2025-06-10", visitors: 155 },
  { date: "2025-06-11", visitors: 92 },
  { date: "2025-06-12", visitors: 492 },
  { date: "2025-06-13", visitors: 81 },
  { date: "2025-06-14", visitors: 426 },
  { date: "2025-06-15", visitors: 307 },
  { date: "2025-06-16", visitors: 371 },
  { date: "2025-06-17", visitors: 475 },
  { date: "2025-06-18", visitors: 107 },
  { date: "2025-06-19", visitors: 341 },
  { date: "2025-06-20", visitors: 408 },
  { date: "2025-06-21", visitors: 169 },
  { date: "2025-06-22", visitors: 317 },
  { date: "2025-06-23", visitors: 480 },
  { date: "2025-06-24", visitors: 132 },
  { date: "2025-06-25", visitors: 141 },
  { date: "2025-06-26", visitors: 434 },
  { date: "2025-06-27", visitors: 448 },
  { date: "2025-06-28", visitors: 149 },
  { date: "2025-06-29", visitors: 103 },
  { date: "2025-06-30", visitors: 446 },
]

const total = chartData.reduce((acc, curr) => acc + curr.visitors, 0)

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig

export default function Calendar27() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 5),
    to: new Date(2025, 5, 20),
  })
  const filteredData = React.useMemo(() => {
    if (!range?.from && !range?.to) {
      return chartData
    }

    return chartData.filter((item) => {
      const date = new Date(item.date)
      return date >= range.from! && date <= range.to!
    })
  }, [range])

  return (
    <Card className="@container/card w-full max-w-xl">
      <CardHeader className="flex flex-col border-b @md/card:grid">
        <CardTitle>Web Analytics</CardTitle>
        <CardDescription>
          Showing total visitors for this month.
        </CardDescription>
        <CardAction className="mt-2 @md/card:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon />
                {range?.from && range?.to
                  ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                  : "June 2025"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="end">
              <Calendar
                className="w-full"
                mode="range"
                defaultMonth={range?.from}
                selected={range}
                onSelect={setRange}
                disableNavigation
                startMonth={range?.from}
                fixedWeeks
                showOutsideDays
                disabled={{
                  after: new Date(2025, 5, 31),
                }}
              />
            </PopoverContent>
          </Popover>
        </CardAction>
      </CardHeader>
      <CardContent className="px-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="visitors"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey="visitors" fill={`var(--color-visitors)`} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="border-t">
        <div className="text-sm">
          You had{" "}
          <span className="font-semibold">{total.toLocaleString()}</span>{" "}
          visitors for the month of June.
        </div>
      </CardFooter>
    </Card>
  )
}
