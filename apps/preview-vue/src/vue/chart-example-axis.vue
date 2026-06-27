<script setup lang="ts">
import type { ChartConfig } from '@/ui/chart'
import { VisAxis, VisGroupedBar, VisXYContainer } from '@unovis/vue'
import { ChartContainer } from '@/ui/chart'

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

type Data = typeof chartData[number]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
} satisfies ChartConfig
</script>

<template>
  <ChartContainer :config="chartConfig" class="min-h-[200px] w-full">
    <VisXYContainer :data="chartData">
      <VisGroupedBar
        :x="(d: Data) => d.month"
        :y="[(d: Data) => d.desktop, (d: Data) => d.mobile]"
        :color="[chartConfig.desktop.color, chartConfig.mobile.color]"
        :rounded-corners="4"
      />
      <VisAxis
        type="x"
        :x="(d: Data) => d.month"
        :tick-line="false"
        :domain-line="false"
        :grid-line="false"
        :tick-format="(value: string) => value.slice(0, 3)"
        :tick-values="chartData.map((d) => d.month)"
      />
      <VisAxis
        type="y"
        :tick-format="(d: number) => ''"
        :tick-line="false"
        :domain-line="false"
        :grid-line="true"
      />
    </VisXYContainer>
  </ChartContainer>
</template>
