import type { Meta, StoryObj } from "@storybook/react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(221 83% 53%)",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(160 60% 45%)",
  },
} satisfies ChartConfig

const meta: Meta<typeof ChartContainer> = {
  title: "UI/Chart",
  component: ChartContainer,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof ChartContainer>

export const BarChartDefault: Story = {
  name: "Bar Chart",
  render: () => (
    <div className="w-[500px]">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart data={chartData} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  ),
}

export const LineChartDefault: Story = {
  name: "Line Chart",
  render: () => (
    <div className="w-[500px]">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart data={chartData} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="desktop"
            stroke="var(--color-desktop)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="mobile"
            stroke="var(--color-mobile)"
            strokeWidth={2}
          />
        </LineChart>
      </ChartContainer>
    </div>
  ),
}
