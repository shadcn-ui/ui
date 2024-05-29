import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from "recharts"

import { Chart } from "@/registry/new-york/ui/chart"

const data = [
  { month: "January", desktop: 186, mobile: 120 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 150 },
  { month: "April", desktop: 73, mobile: 50 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "July", desktop: 260, mobile: 170 },
]

const config = {
  desktop: {
    label: "Desktop",
    colors: {
      light: "#1d4ed8",
      dark: "#14b8a6",
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
    <Chart config={config}>
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
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Tooltip
          cursor={false}
          content={({ payload, active }) => {
            if (!active || !payload?.length) return null

            return (
              <div className="grid min-w-[140px] gap-1 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-sm">
                <div className="font-medium">Visitors</div>
                <div className="grid gap-1">
                  {payload.map((item) => (
                    <div key={item.dataKey} className="flex items-center gap-2">
                      <div
                        className="aspect-square h-2 w-2 shrink-0 rounded-[2px] bg-[--color]"
                        style={
                          {
                            "--color": `var(--color-${item.dataKey})`,
                          } as React.CSSProperties
                        }
                      />
                      <div className="flex w-full flex-col gap-0.5">
                        <div className="flex w-full items-center leading-none text-muted-foreground">
                          {config[item.dataKey as keyof typeof config].label}
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
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={5} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={5} />
      </BarChart>
    </Chart>
  )
}
