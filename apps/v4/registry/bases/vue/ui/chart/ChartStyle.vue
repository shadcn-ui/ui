<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { Primitive } from "reka-ui"
import { computed } from "vue"
import { THEMES, useChart } from "."

defineProps<{
  id?: HTMLAttributes["id"]
}>()

const { config } = useChart()

const colorConfig = computed(() => {
  return Object.entries(config.value).filter(
    ([, config]) => config.theme || config.color,
  )
})
</script>

<template>
  <Primitive
    v-if="colorConfig.length"
    as="style"
  >
    {{ Object.entries(THEMES)
      .map(
        ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color
      = itemConfig.theme?.[theme as keyof typeof itemConfig.theme]
      || itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
        .join("\n")}
}
`,
      )
      .join("\n") }}
  </Primitive>
</template>
