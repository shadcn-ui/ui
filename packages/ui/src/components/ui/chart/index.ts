import { defineComponent, h } from 'vue'
import type { CSSProperties } from 'vue'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'

export type ChartConfig = Record<
  string,
  {
    label?: string
    color?: string
    theme?: { light?: string; dark?: string }
  }
>

let chartId = 0

export const ChartContainer = defineComponent({
  name: 'ChartContainer',
  inheritAttrs: false,
  props: {
    config: { type: Object as () => ChartConfig, default: () => ({}) },
    label: { type: String, default: 'نمودار' },
    id: { type: String, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const fallbackId = `saaze-chart-${++chartId}`
    return () => {
      const id = props.id ?? fallbackId
      const entries = Object.entries(props.config)
      // رنگ روشن به‌صورت inline؛ رنگ تیره (theme.dark) با یک قاعده CSS زیر `.dark`.
      const colors = Object.fromEntries(
        entries.map(([key, value]) => [
          `--color-${key}`,
          value.color ?? value.theme?.light ?? 'currentColor',
        ]),
      ) as CSSProperties
      const darkRules = entries
        .filter(([, value]) => value.theme?.dark)
        .map(([key, value]) => `--color-${key}: ${value.theme?.dark};`)
        .join(' ')
      return h(
        'div',
        {
          ...attrs,
          'data-slot': 'chart',
          'data-chart': id,
          role: 'img',
          'aria-label': props.label,
          class: cn('relative w-full min-w-0 text-foreground', attrs.class),
          style: [colors, attrs.style],
        },
        [
          darkRules
            ? h('style', { innerHTML: `.dark [data-chart="${id}"] { ${darkRules} }` })
            : null,
          slots.default?.(),
        ],
      )
    }
  },
})
export const ChartLegend = createPrimitive(
  'ChartLegend',
  'div',
  'flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground',
  { 'data-slot': 'chart-legend' },
)
export const ChartLegendItem = createPrimitive(
  'ChartLegendItem',
  'div',
  'inline-flex items-center gap-2',
  { 'data-slot': 'chart-legend-item' },
)
export const ChartTooltip = createPrimitive(
  'ChartTooltip',
  'div',
  'rounded-md border border-border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md',
  { 'data-slot': 'chart-tooltip' },
)
export const ChartTooltipContent = createPrimitive(
  'ChartTooltipContent',
  'div',
  'grid gap-1.5 rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-xl',
  { 'data-slot': 'chart-tooltip-content' },
)
