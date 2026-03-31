<script setup lang="ts">
import type { ChartConfig } from "@/ui/chart"
import { VisAxis, VisGroupedBar, VisXYContainer } from "@unovis/vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Example } from "@/components/example"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/card"
import { ChartContainer, ChartCrosshair, ChartTooltip, ChartTooltipContent, componentToString } from "@/ui/chart"

const barChartData = [
  { month: 1, monthLabel: "January", desktop: 186, mobile: 80 },
  { month: 2, monthLabel: "February", desktop: 305, mobile: 200 },
  { month: 3, monthLabel: "March", desktop: 237, mobile: 120 },
  { month: 4, monthLabel: "April", desktop: 73, mobile: 190 },
  { month: 5, monthLabel: "May", desktop: 209, mobile: 130 },
  { month: 6, monthLabel: "June", desktop: 214, mobile: 140 },
]

type Data = typeof barChartData[number]

const barChartConfig = {
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
  <Example title="Bar Chart">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer :config="barChartConfig">
          <VisXYContainer :data="barChartData">
            <VisGroupedBar
              :x="(d: Data) => d.month"
              :y="[(d: Data) => d.desktop, (d: Data) => d.mobile]"
              :color="[barChartConfig.desktop.color, barChartConfig.mobile.color]"
              :rounded-corners="4"
              bar-padding="0.15"
              group-padding="0"
            />
            <VisAxis
              type="x"
              :x="(d: Data) => d.month"
              :tick-line="false"
              :domain-line="false"
              :grid-line="false"
              :num-ticks="6"
              :tick-format="(_d: number, index: number) => barChartData[index]?.monthLabel.slice(0, 3) ?? ''"
            />
            <VisAxis
              type="y"
              :num-ticks="3"
              :tick-line="false"
              :domain-line="false"
            />
            <ChartTooltip />
            <ChartCrosshair
              :template="componentToString(barChartConfig, ChartTooltipContent, { indicator: 'dashed', hideLabel: true })"
              color="#0000"
            />
          </VisXYContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter class="flex-col items-start gap-2">
        <div class="flex gap-2 font-medium leading-none">
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
        <div class="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  </Example>
</template>
