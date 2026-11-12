<script setup lang="ts">
import type { ScrollAreaScrollbarProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { ScrollAreaScrollbar, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<ScrollAreaScrollbarProps & { class?: HTMLAttributes['class'] }>(),
  { orientation: 'vertical' },
)
const forwarded = useForwardProps(props)
</script>

<template>
  <ScrollAreaScrollbar
    v-bind="forwarded"
    :class="
      cn(
        'flex touch-none select-none transition-colors',
        'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5 data-[orientation=vertical]:border-s data-[orientation=vertical]:border-s-transparent data-[orientation=vertical]:p-0.5',
        'data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent data-[orientation=horizontal]:p-0.5',
        props.class,
      )
    "
  >
    <slot />
  </ScrollAreaScrollbar>
</template>
