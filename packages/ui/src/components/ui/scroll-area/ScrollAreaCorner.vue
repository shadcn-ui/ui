<script setup lang="ts">
import type { ScrollAreaCornerProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { ScrollAreaCorner, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ScrollAreaCornerProps & { class?: HTMLAttributes['class'] }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <ScrollAreaCorner v-bind="forwarded" :class="cn('bg-border', props.class)">
    <slot />
  </ScrollAreaCorner>
</template>
