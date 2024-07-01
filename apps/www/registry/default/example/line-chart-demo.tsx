import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

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
          <ChartTooltip
            cursor={false}
            content={({ payload, active }) => {
              if (!active || !payload?.length) return null

              return (
                <div className="flex min-w-[140px] items-center gap-2 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-sm">
                  <div className="h-[1.8rem] w-1 rounded-full bg-primary" />
                  <div className="flex w-full flex-col gap-0.5">
                    <div className="font-medium">Visitors</div>
                    <div className="flex w-full items-center text-muted-foreground">
                      {payload[0]?.dataKey}
                      <div className="ml-auto font-mono font-medium text-foreground">
                        {payload[0]?.payload?.desktop}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
