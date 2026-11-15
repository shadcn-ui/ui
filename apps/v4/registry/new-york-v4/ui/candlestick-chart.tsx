"use client"

import * as React from "react"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  DefaultZIndexes,
  ErrorBar,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts"
import type { BarShapeProps } from "recharts/types/cartesian/Bar"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type CandlestickDatum = {
  open: number
  high: number
  low: number
  close: number
}

// Used as the `name` of the candle series so the tooltip can find it.
const CANDLE_NAME = "Price"

const defaultConfig = {
  up: {
    label: "Up",
    color: "var(--chart-1)",
  },
  down: {
    label: "Down",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

// The body of a candle spans open to close. Use as the `dataKey` of a `Bar`.
const candlestickBody = (datum: CandlestickDatum): [number, number] => [
  Math.min(datum.open, datum.close),
  Math.max(datum.open, datum.close),
]

// The wick spans low to high. An `ErrorBar` measures it as offsets from the
// top of the body. Use as the `dataKey` of an `ErrorBar`.
const candlestickWick = (datum: CandlestickDatum): [number, number] => {
  const bodyTop = Math.max(datum.open, datum.close)
  return [bodyTop - datum.low, datum.high - bodyTop]
}

// Formats ISO dates such as "2024-06-30" for axis ticks and tooltips. Any
// other value is shown as it is.
function formatCandleDate(value: unknown, withYear = false) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return String(value)
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(withYear && { year: "numeric" }),
    // A date without a time is UTC, so format it as UTC to keep the same day.
    ...(value.length === 10 && { timeZone: "UTC" }),
  })
}

// A Y axis domain that fits every candle, with a little room around it.
function getCandlestickDomain(
  data: CandlestickDatum[],
  padding = 0.05
): [number, number] {
  if (data.length === 0) {
    return [0, 1]
  }

  let low = Infinity
  let high = -Infinity
  for (const datum of data) {
    low = Math.min(low, datum.low)
    high = Math.max(high, datum.high)
  }

  const pad = (high - low) * padding || 1
  return [low - pad, high + pad]
}

// The default candle body. It receives the bar rectangle for open to close,
// and the row you passed in as `props.payload`.
function CandlestickShape(props: BarShapeProps) {
  const { open, close } = props.payload as CandlestickDatum

  return (
    <Rectangle
      {...props}
      fill={close >= open ? "var(--color-up)" : "var(--color-down)"}
      stroke="none"
    />
  )
}

// Shows open, high, low and close. Any other series in the chart, such as a
// `Line`, is listed below them.
function CandlestickTooltipContent(
  props: React.ComponentProps<typeof ChartTooltipContent>
) {
  return (
    <ChartTooltipContent
      hideIndicator
      labelFormatter={(value) => formatCandleDate(value, true)}
      formatter={(value, name, item) => (
        <div className="grid w-full gap-1.5">
          {name === CANDLE_NAME ? (
            (["open", "high", "low", "close"] as const).map((key) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 leading-none"
              >
                <span className="text-muted-foreground capitalize">{key}</span>
                <span className="font-mono font-medium text-foreground tabular-nums">
                  {item.payload[key]}
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between gap-4 leading-none">
              <span className="text-muted-foreground">{name}</span>
              <span className="font-mono font-medium text-foreground tabular-nums">
                {typeof value === "number" ? value.toFixed(2) : value}
              </span>
            </div>
          )}
        </div>
      )}
      {...props}
    />
  )
}

type CandlestickChartProps<T extends CandlestickDatum> = Omit<
  React.ComponentProps<typeof ComposedChart>,
  "data" | "children" | "className"
> & {
  /** One row per candle, oldest first. */
  data: T[]
  /** The key on each row used for the X axis. Defaults to "date". */
  xKey?: string
  /** Merged over the default `up` and `down` colors. */
  config?: ChartConfig
  /** Your own candle body. Receives `BarShapeProps`, with the row as `payload`. */
  shape?: React.ComponentProps<typeof Bar>["shape"]
  /** Props for the wick `ErrorBar`, or `false` to hide the wick. */
  wick?: false | Partial<React.ComponentProps<typeof ErrorBar>>
  /** Props passed to the candle `Bar`. The `dataKey` is always the candle body. */
  barProps?: Partial<
    Omit<React.ComponentProps<typeof Bar>, "dataKey" | "children">
  >
  className?: string
  /**
   * Your own axes, grid, tooltip, lines and so on. When you pass children,
   * the chart renders only them and the candles. Without children it adds a
   * grid, axes and a tooltip.
   */
  children?: React.ReactNode
}

function CandlestickChart<T extends CandlestickDatum>({
  data,
  xKey = "date",
  config,
  shape = CandlestickShape,
  wick,
  barProps,
  className,
  children,
  ...props
}: CandlestickChartProps<T>) {
  const chartConfig = React.useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config]
  )
  const domain = React.useMemo(() => getCandlestickDomain(data), [data])

  return (
    <ChartContainer config={chartConfig} className={className}>
      <ComposedChart accessibilityLayer data={data} {...props}>
        {children ?? (
          <>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => formatCandleDate(value)}
            />
            <YAxis
              width={40}
              tickLine={false}
              axisLine={false}
              domain={domain}
            />
            <ChartTooltip
              cursor={false}
              content={<CandlestickTooltipContent />}
            />
          </>
        )}
        <Bar
          name={CANDLE_NAME}
          dataKey={candlestickBody}
          shape={shape}
          {...barProps}
        >
          {wick !== false && (
            <ErrorBar
              dataKey={candlestickWick}
              width={0}
              stroke="var(--muted-foreground)"
              strokeWidth={1.5}
              zIndex={DefaultZIndexes.bar - 1}
              {...wick}
            />
          )}
        </Bar>
      </ComposedChart>
    </ChartContainer>
  )
}

export {
  CandlestickChart,
  CandlestickShape,
  CandlestickTooltipContent,
  candlestickBody,
  candlestickWick,
  getCandlestickDomain,
  type CandlestickChartProps,
  type CandlestickDatum,
}
