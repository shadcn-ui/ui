<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  DropdownMenuSubTrigger,
  type DropdownMenuSubTriggerProps,
  useForwardProps,
} from 'radix-vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useDropdownDirection } from '@/lib/rtl'

const props = defineProps<
  DropdownMenuSubTriggerProps & { inset?: boolean; class?: HTMLAttributes['class'] }
>()
const forwarded = useForwardProps(props)
const direction = useDropdownDirection()
</script>

<template>
  <DropdownMenuSubTrigger
    v-bind="forwarded"
    :class="
      cn(
        'flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        '[&_svg]:size-4 [&_svg]:shrink-0',
        props.inset && 'ps-8',
        props.class,
      )
    "
  >
    <slot />
    <ChevronLeft v-if="direction === 'rtl'" class="ms-auto size-4" aria-hidden="true" />
    <ChevronRight v-else class="ms-auto size-4" aria-hidden="true" />
  </DropdownMenuSubTrigger>
</template>
