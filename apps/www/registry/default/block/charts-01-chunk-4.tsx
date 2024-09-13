"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardFooter } from "@/registry/default/ui/card"
import { ChartContainer } from "@/registry/default/ui/chart"
import { Separator } from "@/registry/default/ui/separator"

export default function Component() {
  return (
    <Card className="max-w-xs" x-chunk="charts-01-chunk-4">
      <CardContent className="flex gap-4 p-4 pb-2">
        <ChartContainer
          config={{
            move: {
              label: "Move",
              color: "hsl(var(--chart-1))",
            },
            stand: {
              label: "Stand",
              color: "hsl(var(--chart-2))",
            },
            exercise: {
              label: "Exercise",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[140px] w-full"
        >
          <BarChart
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 10,
            }}
            data={[
              {
                activity: "stand",
                value: (8 / 12) * 100,
                label: "8/12 hr",
                fill: "var(--color-stand)",
              },
              {
                activity: "exercise",
                value: (46 / 60) * 100,
                label: "46/60 min",
                fill: "var(--color-exercise)",
              },
              {
                activity: "move",
                value: (245 / 360) * 100,
                label: "245/360 kcal",
                fill: "var(--color-move)",
              },
            ]}
            layout="vertical"
            barSize={32}
            barGap={2}
          >
            <XAxis type="number" dataKey="value" hide />
            <YAxis
              dataKey="activity"
              type="category"
              tickLine={false}
              tickMargin={4}
              axisLine={false}
              className="capitalize"
            />
            <Bar dataKey="value" radius={5}>
              <LabelList
                position="insideLeft"
                dataKey="label"
                fill="white"
                offset={8}
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-row border-t p-4">
        <div className="flex w-full items-center gap-2">
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-xs text-muted-foreground">Move</div>
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
              562
              <span className="text-sm font-normal text-muted-foreground">
                kcal
              </span>
            </div>
          </div>
          <Separator orientation="vertical" className="mx-2 h-10 w-px" />
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-xs text-muted-foreground">Exercise</div>
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
              73
              <span className="text-sm font-normal text-muted-foreground">
                min
              </span>
            </div>
          </div>
          <Separator orientation="vertical" className="mx-2 h-10 w-px" />
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-xs text-muted-foreground">Stand</div>
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
              14
              <span className="text-sm font-normal text-muted-foreground">
                hr
              </span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
