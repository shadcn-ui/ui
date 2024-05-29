import {
  CartesianGrid,
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
  { month: "February", desktop: 105, mobile: 200 },
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
      light: "#f43f5e",
      dark: "#ec4899",
    },
  },
  mobile: {
    label: "Mobile",
    colors: {
      light: "#e879f9",
      dark: "#a78bfa",
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
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => (value === 0 ? "" : `${value}k`)}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend content={<ChartLegend />} />
        <Line
          dataKey="desktop"
          type="linear"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={{
            r: 3,
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
      </LineChart>
    </Chart>
  )
}
