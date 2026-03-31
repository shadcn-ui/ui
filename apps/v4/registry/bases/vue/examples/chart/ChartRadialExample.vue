<script setup lang="ts">
import type { ChartConfig } from "@/ui/chart"
import { Donut } from "@unovis/ts"
import { VisDonut, VisSingleContainer } from "@unovis/vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Example } from "@/components/example"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, componentToString } from "@/ui/chart"

const radialChartData = [
  { browser: "safari", visitors: 1260 },
]

type Data = typeof radialChartData[number]

const radialChartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig
</script>

<template>
  <Example title="Radial Chart">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Radial Chart - Shape</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent class="flex-1 pb-0">
        <ChartContainer
          :config="radialChartConfig"
          class="mx-auto aspect-square max-h-[210px]"
          :style="{
            '--vis-donut-central-label-font-size': 'var(--text-3xl)',
            '--vis-donut-central-label-font-weight': 'var(--font-weight-bold)',
            '--vis-donut-central-label-text-color': 'var(--foreground)',
            '--vis-donut-central-sub-label-text-color': 'var(--muted-foreground)',
          }"
        >
          <VisSingleContainer :data="radialChartData" :margin="{ top: 30, bottom: 30 }">
            <VisDonut
              :value="(d: Data) => d.visitors"
              :color="radialChartConfig.safari.color"
              :arc-width="30"
              :central-label="radialChartData[0]?.visitors.toLocaleString()"
              central-sub-label="Visitors"
            />
            <ChartTooltip
              :triggers="{
                [Donut.selectors.segment]: componentToString(radialChartConfig, ChartTooltipContent, { hideLabel: true })!,
              }"
            />
          </VisSingleContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter class="flex-col gap-2">
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
        <div class="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  </Example>
</template>
