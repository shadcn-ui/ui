<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ProgressIndicator, ProgressRoot, type ProgressRootProps } from 'radix-vue'
import { useResolvedDirection, type Direction } from '@/lib/rtl'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<ProgressRootProps & { class?: HTMLAttributes['class']; dir?: Direction }>(),
  {
    modelValue: 0,
  },
)

const delegatedProps = reactiveOmit(props, 'class', 'dir')
const dir = useResolvedDirection(() => props.dir)
const value = computed(() => Math.min(100, Math.max(0, Number(props.modelValue ?? 0))))
const indicatorStyle = computed(() => ({
  transform: `translateX(${dir.value === 'rtl' ? 100 - value.value : value.value - 100}%)`,
}))
</script>

<template>
  <ProgressRoot
    v-bind="delegatedProps"
    :class="cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', props.class)"
  >
    <ProgressIndicator
      class="h-full w-full flex-1 bg-primary transition-all"
      :style="indicatorStyle"
    />
  </ProgressRoot>
</template>
