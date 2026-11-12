<script setup lang="ts">
import type { ScrollAreaRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { ScrollAreaRoot, useForwardProps } from 'radix-vue'
import { reactiveOmit } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { useResolvedDirection } from '@/lib/rtl'

const props = withDefaults(
  defineProps<ScrollAreaRootProps & { class?: HTMLAttributes['class'] }>(),
  {
    type: 'hover',
    scrollHideDelay: 600,
  },
)

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
const dir = useResolvedDirection(() => props.dir)
</script>

<template>
  <ScrollAreaRoot
    v-bind="forwarded"
    :dir="dir"
    :class="cn('relative overflow-hidden', props.class)"
  >
    <slot />
  </ScrollAreaRoot>
</template>
