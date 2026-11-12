<script setup lang="ts">
import type { ScrollAreaViewportProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { ScrollAreaViewport, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ScrollAreaViewportProps & { class?: HTMLAttributes['class'] }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <ScrollAreaViewport v-bind="forwarded" :class="cn('size-full rounded-[inherit]', props.class)">
    <slot />
  </ScrollAreaViewport>
</template>
