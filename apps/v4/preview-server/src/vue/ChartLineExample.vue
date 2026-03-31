<script setup lang="ts">
import type { ChartConfig } from "@/ui/chart"
import { CurveType } from "@unovis/ts"
import { VisAxis, VisLine, VisXYContainer } from "@unovis/vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Example } from "@/components"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/card"
import { ChartContainer, ChartCrosshair, ChartTooltip, ChartTooltipContent, componentToString } from "@/ui/chart"

const lineChartData = [
  { month: 1, monthLabel: "January", desktop: 186, mobile: 80 },
  { month: 2, monthLabel: "February", desktop: 305, mobile: 200 },
  { month: 3, monthLabel: "March", desktop: 237, mobile: 120 },
  { month: 4, monthLabel: "April", desktop: 73, mobile: 190 },
  { month: 5, monthLabel: "May", desktop: 209, mobile: 130 },
  { month: 6, monthLabel: "June", desktop: 214, mobile: 140 },
]

type Data = typeof lineChartData[number]

const lineChartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig
</script>

<template>
  <Example title="Line Chart">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer :config="lineChartConfig">
          <VisXYContainer :data="lineChartData" :margin="{ left: 12, right: 12 }">
            <VisLine
              :x="(d: Data) => d.month"
              :y="[(d: Data) => d.desktop, (d: Data) => d.mobile]"
              :color="[lineChartConfig.desktop.color, lineChartConfig.mobile.color]"
              :curve-type="CurveType.MonotonX"
              :line-width="2"
            />
            <VisAxis
              type="x"
              :x="(d: Data) => d.month"
              :tick-line="false"
              :domain-line="false"
              :grid-line="false"
              :num-ticks="6"
              :tick-format="(_d: number, index: number) => lineChartData[index]?.monthLabel.slice(0, 3) ?? ''"
            />
            <ChartTooltip />
            <ChartCrosshair
              :template="componentToString(lineChartConfig, ChartTooltipContent, { labelKey: 'monthLabel' })"
              :color="(d: Data, i: number) => [lineChartConfig.desktop.color, lineChartConfig.mobile.color][i % 2]"
            />
          </VisXYContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div class="flex w-full items-start gap-2">
          <div class="grid gap-2">
            <div class="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month
              <IconPlaceholder
                lucide="TrendingUpIcon"
                tabler="IconTrendingUp"
                hugeicons="ChartUpIcon"
                phosphor="TrendUpIcon"
                remixicon="RiLineChartLine"
                class="size-4"
              />
            </div>
            <div class="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  </Example>
</template>
