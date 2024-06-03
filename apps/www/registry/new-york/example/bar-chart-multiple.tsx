import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis } from "recharts"

import {
  Chart,
  ChartLegend,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york/ui/chart"

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
      light: "#3b82f6",
      dark: "#93c5fd",
    },
  },
  mobile: {
    label: "Mobile",
    colors: {
      light: "#93c5fd",
      dark: "#27272a",
    },
  },
} satisfies ChartConfig

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
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <Tooltip cursor={false} label={false} content={<ChartTooltip />} />
        <Legend content={<ChartLegend />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}
