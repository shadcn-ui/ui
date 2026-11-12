<script setup lang="ts">
import type { ContextMenuSubContentEmits, ContextMenuSubContentProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { ContextMenuPortal, ContextMenuSubContent, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<ContextMenuSubContentProps & { class?: HTMLAttributes['class'] }>(), { sideOffset: 4 })
const emits = defineEmits<ContextMenuSubContentEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ContextMenuPortal>
    <ContextMenuSubContent v-bind="forwarded" :class="cn('z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95', props.class)">
      <slot />
    </ContextMenuSubContent>
  </ContextMenuPortal>
</template>
