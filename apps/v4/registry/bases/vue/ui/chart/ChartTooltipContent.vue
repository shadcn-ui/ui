<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { ChartConfig } from "."
import { computed } from "vue"
import { cn } from "@/lib/utils"

const props = withDefaults(defineProps<{
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  nameKey?: string
  labelKey?: string
  labelFormatter?: (d: number | Date) => string
  payload?: Record<string, any>
  config?: ChartConfig
  class?: HTMLAttributes["class"]
  color?: string
  x?: number | Date
}>(), {
  payload: () => ({}),
  config: () => ({}),
  indicator: "dot",
})

// TODO: currently we use `createElement` and `render` to render the
// const chartContext = useChart(null)

const payload = computed(() => {
  return Object.entries(props.payload).map(([key, value]) => {
    // const key = `${props.nameKey || item.name || item.dataKey || "value"}`
    const itemConfig = props.config[key]
    const indicatorColor = props.config[key]?.color ?? props.payload.fill

    return { key, value, itemConfig, indicatorColor }
  }).filter(i => i.itemConfig)
})

const nestLabel = computed(() => Object.keys(props.payload).length === 1 && props.indicator !== "dot")
const tooltipLabel = computed(() => {
  if (props.hideLabel)
    return null
  if (props.labelFormatter && props.x !== undefined) {
    return props.labelFormatter(props.x)
  }
  return props.labelKey ? props.config[props.labelKey]?.label || props.payload[props.labelKey] : props.x
})
</script>

<template>
  <div
    :class="cn(
      'border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl',
      props.class,
    )"
  >
    <slot>
      <div v-if="!nestLabel && tooltipLabel" class="font-medium">
        {{ tooltipLabel }}
      </div>
      <div class="grid gap-1.5">
        <div
          v-for="{ value, itemConfig, indicatorColor, key } in payload"
          :key="key"
          :class="
            cn('[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5',
               indicator === 'dot' && 'items-center')"
        >
          <component :is="itemConfig.icon" v-if="itemConfig?.icon" />
          <template v-else-if="!hideIndicator">
            <div
              :class="cn(
                'shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)',
                {
                  'h-2.5 w-2.5': indicator === 'dot',
                  'w-1': indicator === 'line',
                  'w-0 border-[1.5px] border-dashed bg-transparent':
                    indicator === 'dashed',
                  'my-0.5': nestLabel && indicator === 'dashed',
                },
              )"
              :style="{
                '--color-bg': indicatorColor,
                '--color-border': indicatorColor,
              }"
            />
          </template>

          <div :class="cn('flex flex-1 justify-between leading-none', nestLabel ? 'items-end' : 'items-center')">
            <div class="grid gap-1.5">
              <div v-if="nestLabel" class="font-medium">
                {{ tooltipLabel }}
              </div>
              <span class="text-muted-foreground">
                {{ itemConfig?.label || value }}
              </span>
            </div>
            <span v-if="value" class="text-foreground font-mono font-medium tabular-nums">
              {{ value.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>
