<script setup lang="ts">
import type { SplitterGroupEmits, SplitterGroupProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { SplitterGroup, useForwardPropsEmits } from 'radix-vue'
import { useResolvedDirection } from '@/lib/rtl'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<SplitterGroupProps & { class?: HTMLAttributes['class']; dir?: 'rtl' | 'ltr' }>(),
  { direction: 'horizontal', dir: undefined },
)
const emits = defineEmits<SplitterGroupEmits>()
const delegatedProps = reactiveOmit(props, 'class', 'dir')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
const resolvedDir = useResolvedDirection(() => props.dir)
</script>

<template>
  <SplitterGroup
    v-bind="forwarded"
    :dir="resolvedDir"
    :class="cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', props.class)"
  >
    <slot />
  </SplitterGroup>
</template>
