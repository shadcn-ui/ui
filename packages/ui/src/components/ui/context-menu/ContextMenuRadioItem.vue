<script setup lang="ts">
import type { ContextMenuRadioItemEmits, ContextMenuRadioItemProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { ContextMenuItemIndicator, ContextMenuRadioItem, useForwardPropsEmits } from 'radix-vue'
import { Circle } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<ContextMenuRadioItemProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<ContextMenuRadioItemEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ContextMenuRadioItem v-bind="forwarded" :class="cn('relative flex cursor-default select-none items-center rounded-sm py-1.5 pe-2 ps-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', props.class)">
    <span class="absolute start-2 flex size-3.5 items-center justify-center">
      <ContextMenuItemIndicator><Circle class="size-2 fill-current" /></ContextMenuItemIndicator>
    </span>
    <slot />
  </ContextMenuRadioItem>
</template>
