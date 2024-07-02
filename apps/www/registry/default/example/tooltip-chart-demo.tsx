import { CartesianGrid, Line, LineChart, ResponsiveContainer } from "recharts"

const data = [
  { desktop: 186 },
  { desktop: 305 },
  { desktop: 237 },
  { desktop: 73 },
  { desktop: 209 },
  { desktop: 214 },
  { desktop: 260 },
]

export default function Component() {
  return (
    <div className="aspect-[16/7] w-full">
      <ResponsiveContainer className="h-full w-full">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} className="stroke-border/40" />
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
