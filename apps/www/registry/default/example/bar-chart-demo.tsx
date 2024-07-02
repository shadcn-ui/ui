import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"

const data = [
  { month: "January", desktop: 186, mobile: 120 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 150 },
  { month: "April", desktop: 73, mobile: 50 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "July", desktop: 260, mobile: 170 },
]

export default function Component() {
  return (
    <div className="aspect-video w-full">
      <ResponsiveContainer className="h-full w-full text-xs">
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
            axisLine={{ className: "stroke-border" }}
          />
          <Bar
            dataKey="desktop"
            className="rounded-t-xl fill-primary"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="mobile"
            className="fill-muted-foreground/50"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
