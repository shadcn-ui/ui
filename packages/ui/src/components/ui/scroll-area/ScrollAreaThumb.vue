<script setup lang="ts">
import type { ScrollAreaThumbProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { ScrollAreaThumb, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ScrollAreaThumbProps & { class?: HTMLAttributes['class'] }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <ScrollAreaThumb
    v-bind="forwarded"
    :class="cn('relative flex-1 rounded-full bg-border', props.class)"
  >
    <slot />
  </ScrollAreaThumb>
</template>
