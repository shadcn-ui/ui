<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { computed, onMounted, ref } from "vue"
import { cn } from "@/lib/utils"
import { useChart } from "."

const props = withDefaults(defineProps<{
  hideIcon?: boolean
  nameKey?: string
  verticalAlign?: "bottom" | "top"
  // payload?: any[]
  class?: HTMLAttributes["class"]
}>(), {
  verticalAlign: "bottom",
})

const { id, config } = useChart()

const payload = computed(() => Object.entries(config.value).map(([key, value]) => {
  return {
    key: props.nameKey || key,
    itemConfig: config.value[key],
  }
}))

const containerSelector = ref("")
onMounted(() => {
  containerSelector.value = `[data-chart="chart-${id}"]>[data-vis-xy-container]`
})
</script>

<template>
  <div
    v-if="containerSelector"
    :class="cn(
      'flex items-center justify-center gap-4',
      verticalAlign === 'top' ? 'pb-3' : 'pt-3',
      props.class,
    )"
  >
    <div
      v-for="{ key, itemConfig } in payload"
      :key="key"
      :class="cn(
        '[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3',
      )"
    >
      <component :is="itemConfig.icon" v-if="itemConfig?.icon" />
      <div
        v-else
        class="h-2 w-2 shrink-0 rounded-[2px]"
        :style="{
          backgroundColor: itemConfig.color,
        }"
      />

      {{ itemConfig?.label }}
    </div>
  </div>
</template>
