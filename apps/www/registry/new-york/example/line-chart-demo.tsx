import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  Text,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york/ui/chart"

const data = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "July", desktop: 260 },
]

const config = {
  desktop: {
    label: "Desktop",
    colors: {
      light: "#000000",
      dark: "#a1a1aa",
    },
  },
}

export default function Component() {
  return (
    <div className="grid w-full gap-4">
      <ChartContainer config={config}>
        <LineChart
          data={data}
          margin={{
            top: 15,
            right: 15,
            left: -15,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tickFormatter={(value) => (value === 0 ? "" : `${value}k`)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="desktop"
            type="natural"
            strokeWidth={2}
            stroke="var(--color-desktop)"
            dot={{
              r: 0,
              fill: "var(--color-desktop)",
            }}
            activeDot={{
              fill: "var(--color-desktop)",
              stroke: "transparent",
            }}
          />
        </LineChart>
      </ChartContainer>
      <div className="text-center text-xs text-muted-foreground">
        Total visitors for the last 6 months
      </div>
    </div>
  )
}
