import { ArrowLeftFromLine, Book, Lamp, Settings2 } from "lucide-react"
import {
  CartesianGrid,
  Dot,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Chart, ChartLegend, ChartTooltip } from "@/registry/new-york/ui/chart"

const data = [
  { month: "January", desktop: 186, mobile: 120 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 150 },
  { month: "April", desktop: 73, mobile: 150 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "July", desktop: 260, mobile: 310 },
]

const config = {
  desktop: {
    label: "Desktop",
    colors: {
      light: "#f59e0b",
      dark: "#22c55e",
    },
  },
  mobile: {
    label: "Mobile",
    colors: {
      light: "#06b6d4",
      dark: "#f43f5e",
    },
  },
}

export default function Component() {
  return (
    <Chart config={config}>
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
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
          tickMargin={10}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => (value === 0 ? "" : `${value}k`)}
        />
        <Tooltip content={<ChartTooltip indicator="dot" />} />
        <Line
          dataKey="desktop"
          type="linear"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={{
            r: 0,
          }}
        />
        <Line
          dataKey="mobile"
          type="linear"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={{
            r: 0,
          }}
        />
        <Legend verticalAlign="bottom" content={<ChartLegend hideIcon />} />
      </LineChart>
    </Chart>
  )
}
