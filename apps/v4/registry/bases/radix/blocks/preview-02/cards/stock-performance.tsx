"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/bases/radix/ui/chart"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/bases/radix/ui/combobox"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/radix/ui/field"
import { Separator } from "@/registry/bases/radix/ui/separator"

const TICKERS = ["VOO", "VIG", "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]

const CHART_DATA: Record<string, { month: string; price: number }[]> = {
  VOO: [
    { month: "Jan", price: 412 },
    { month: "Feb", price: 438 },
    { month: "Mar", price: 395 },
    { month: "Apr", price: 450 },
    { month: "May", price: 420 },
    { month: "Jun", price: 462 },
  ],
  AAPL: [
    { month: "Jan", price: 185 },
    { month: "Feb", price: 210 },
    { month: "Mar", price: 172 },
    { month: "Apr", price: 198 },
    { month: "May", price: 178 },
    { month: "Jun", price: 215 },
  ],
}

const DEFAULT_DATA = [
  { month: "Jan", price: 100 },
  { month: "Feb", price: 118 },
  { month: "Mar", price: 95 },
  { month: "Apr", price: 125 },
  { month: "May", price: 108 },
  { month: "Jun", price: 130 },
]

const chartConfig = {
  price: {
    label: "Price",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function StockPerformance() {
  const [ticker, setTicker] = React.useState("VOO")

  const data = CHART_DATA[ticker] ?? DEFAULT_DATA

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Performance</CardTitle>
        <CardDescription>6-month price history.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="ticker-select">Ticker</FieldLabel>
            <Combobox
              items={TICKERS}
              value={ticker}
              onValueChange={(value) => {
                if (value !== null) setTicker(value)
              }}
            >
              <ComboboxInput
                id="ticker-select"
                placeholder="Search ticker..."
              />
              <ComboboxContent>
                <ComboboxEmpty>No tickers found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
        </FieldGroup>
        <Separator className="style-sera:hidden" />
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-price)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-price)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="var(--color-price)"
              strokeWidth={2}
              fill="url(#fillPrice)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
