import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from "recharts"

import {
  Chart,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york/ui/chart"

const data = [
  { month: "January", desktop: 186, mobile: 120 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 150 },
  { month: "April", desktop: 73, mobile: 50 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "July", desktop: 260, mobile: 310 },
]

const config = {
  desktop: {
    label: "Desktop",
    colors: {
      light: "#84cc16",
      dark: "#e4e4e7",
    },
  },
  mobile: {
    label: "Mobile",
    colors: {
      light: "#e4e4e7",
      dark: "#27272a",
    },
  },
} satisfies ChartConfig

export default function Component() {
  return (
    <ChartContainer config={config} className="aspect-video max-w-xl">
      <BarChart
        data={data}
        barSize={32}
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
        <Tooltip cursor={false} content={<ChartTooltip />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}
