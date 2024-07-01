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
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
