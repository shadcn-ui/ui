import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { ChartContainer } from "@/registry/new-york/ui/chart"

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
      light: "#0ea5e9",
      dark: "#34d399",
    },
  },
  mobile: {
    label: "Mobile",
    colors: {
      light: "#f5a623",
      dark: "#f9d78c",
    },
  },
}

export default function Component() {
  return (
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
        <CartesianGrid vertical={false} className="stroke-border/40" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={{ className: "stroke-border" }}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={{ className: "stroke-border" }}
          tickFormatter={(value) => (value === 0 ? "" : `${value}k`)}
        />
        <Line
          dataKey="desktop"
          type="natural"
          strokeWidth={2}
          className="stroke-[--color-desktop]"
          stroke=""
          dot={{
            className: "fill-background",
          }}
          activeDot={{
            r: 6,
            className: "fill-[--color-desktop]",
            fill: "",
          }}
        />
        <Line
          dataKey="mobile"
          type="natural"
          strokeWidth={2}
          className="stroke-[--color-mobile]"
          stroke=""
          dot={{
            className: "fill-background",
          }}
          activeDot={{
            r: 6,
            className: "fill-[--color-mobile]",
            fill: "",
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}
