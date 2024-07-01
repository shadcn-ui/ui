import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

import { Chart } from "@/registry/new-york/ui/chart"

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
      light: "#0ea5e9",
      dark: "#34d399",
    },
  },
  mobile: {
    label: "Mobile",
    colors: {
      light: "#f5a623",
      dark: "#f9d78c",
    },
  },
}

export default function Component() {
  return (
    <ChartContainer config={config}>
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
          tickFormatter={(value) => value.slice(0, 3)}
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
          className="stroke-[--color-desktop]"
          stroke=""
          dot={{
            className: "fill-background",
          }}
          activeDot={{
            r: 6,
            className: "fill-[--color-desktop]",
            fill: "",
          }}
        />
        <Line
          dataKey="mobile"
          type="natural"
          strokeWidth={2}
          className="stroke-[--color-mobile]"
          stroke=""
          dot={{
            className: "fill-background",
          }}
          activeDot={{
            r: 6,
            className: "fill-[--color-mobile]",
            fill: "",
          }}
        />
        <ChartTooltip
          content={({ payload, active }) => {
            if (!active || !payload?.length) return null

            return (
              <div className="grid min-w-[140px] gap-1 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-sm">
                <div className="font-medium">Visitors</div>
                <div className="grid gap-1">
                  {payload.map((item) => (
                    <div key={item.dataKey} className="flex items-center gap-2">
                      <div className="size-2 aspect-square shrink-0 rounded-[2px] bg-primary" />
                      <div className="flex w-full flex-col gap-0.5">
                        <div className="flex w-full items-center leading-none text-muted-foreground">
                          {item.name}
                          <span className="ml-auto font-mono font-medium text-foreground">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}
