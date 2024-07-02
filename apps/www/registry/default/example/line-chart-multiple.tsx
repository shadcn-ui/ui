import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
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
      <ResponsiveContainer className="size-full text-xs">
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
            className="stroke-primary"
            stroke=""
            dot={{
              className: "fill-background",
            }}
            activeDot={{
              r: 6,
              className: "fill-primary",
              fill: "",
              onClick: (e, d) => {
                console.log(e, d)
              },
            }}
          />
          <Line
            dataKey="desktop"
            type="natural"
            strokeWidth={2}
            className="stroke-primary"
            stroke=""
            dot={{
              className: "fill-background",
            }}
            activeDot={{
              r: 6,
              className: "fill-primary",
              fill: "",
              onClick: (e, d) => {
                console.log(e, d)
              },
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
