<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DropdownMenuItem, type DropdownMenuItemProps, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<
  DropdownMenuItemProps & { inset?: boolean; class?: HTMLAttributes['class'] }
>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DropdownMenuItem
    v-bind="forwarded"
    :class="
      cn(
        'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        '[&_svg]:size-4 [&_svg]:shrink-0',
        props.inset && 'ps-8',
        props.class,
      )
    "
  >
    <slot />
  </DropdownMenuItem>
</template>
