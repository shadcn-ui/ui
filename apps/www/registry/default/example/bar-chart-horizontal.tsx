import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { ChartContainer } from "@/registry/new-york/ui/chart"

const data = [
  { month: "January", desktop: 186, mobile: 120 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 150 },
  { month: "April", desktop: 73, mobile: 50 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "July", desktop: 260, mobile: 170 },
]

const config = {
  desktop: {
    label: "Desktop",
    colors: {
      light: "#1d4ed8",
      dark: "#14b8a6",
    },
  },
  mobile: {
    label: "Mobile",
    colors: {
      light: "#f43f5e",
      dark: "#f43f5e",
    },
  },
}

export default function Component() {
  return (
    <ChartContainer config={config}>
      <BarChart
        data={data}
        margin={{
          top: 15,
          right: 15,
          left: 15,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} className="stroke-border/40" />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Bar dataKey="desktop" fill="var(--chart-desktop)" radius={5} />
        <Bar dataKey="mobile" fill="var(--chart-mobile)" radius={5} />
      </BarChart>
    </ChartContainer>
  )
}
