<script setup lang="ts">
import type { ChartConfig } from "@/ui/chart"
import { VisArea, VisAxis, VisLine, VisXYContainer } from "@unovis/vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Example } from "@/components/example"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/card"
import { ChartContainer, ChartCrosshair, ChartTooltip, ChartTooltipContent, componentToString } from "@/ui/chart"

const areaChartData = [
  { month: 1, monthLabel: "January", desktop: 186 },
  { month: 2, monthLabel: "February", desktop: 305 },
  { month: 3, monthLabel: "March", desktop: 237 },
  { month: 4, monthLabel: "April", desktop: 73 },
  { month: 5, monthLabel: "May", desktop: 209 },
  { month: 6, monthLabel: "June", desktop: 214 },
]

type Data = typeof areaChartData[number]

const areaChartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig
</script>

<template>
  <Example title="Area Chart">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Area Chart</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer :config="areaChartConfig">
          <VisXYContainer :data="areaChartData" :margin="{ left: 12, right: 12 }">
            <VisArea
              :x="(d: Data) => d.month"
              :y="(d: Data) => d.desktop"
              :color="areaChartConfig.desktop.color"
              :opacity="0.4"
            />
            <VisLine
              :x="(d: Data) => d.month"
              :y="(d: Data) => d.desktop"
              :color="areaChartConfig.desktop.color"
              :line-width="1"
            />
            <VisAxis
              type="x"
              :x="(d: Data) => d.month"
              :tick-line="false"
              :domain-line="false"
              :grid-line="false"
              :num-ticks="6"
              :tick-format="(_d: number, index: number) => areaChartData[index]?.monthLabel.slice(0, 3) ?? ''"
            />
            <ChartTooltip />
            <ChartCrosshair
              :template="componentToString(areaChartConfig, ChartTooltipContent, { indicator: 'line', labelKey: 'monthLabel' })"
              :color="areaChartConfig.desktop.color"
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
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  </Example>
</template>
