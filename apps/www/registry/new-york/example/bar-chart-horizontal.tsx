import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { ChartContainer, ChartTooltip } from "@/registry/new-york/ui/chart"

const data = [
  { month: "January", desktop: 186, mobile: 120 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 150 },
  { month: "April", desktop: 73, mobile: 50 },
  { month: "May", desktop: 209, mobile: 130 },
]

const config = {
  desktop: {
    label: "Desktop",
    colors: {
      light: "#f1f5f9",
      dark: "#18181b",
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
    <ChartContainer config={config} className="aspect-[8/3]">
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        barCategoryGap={5}
      >
        <YAxis
          dataKey="month"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
          hide
        />
        <XAxis dataKey="desktop" type="number" hide />
        <Tooltip cursor={false} content={<ChartTooltip />} />
        <Bar
          dataKey="desktop"
          layout="vertical"
          fill="var(--color-desktop)"
          radius={5}
        >
          <LabelList
            dataKey="month"
            position="insideLeft"
            offset={12}
            fill="hsla(var(--foreground))"
            fontSize={14}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
