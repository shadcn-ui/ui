<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  DropdownMenuSubTrigger,
  type DropdownMenuSubTriggerProps,
  useForwardProps,
} from 'radix-vue'
import { reactiveOmit } from '@vueuse/core'
import { ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<
  DropdownMenuSubTriggerProps & { inset?: boolean; class?: HTMLAttributes['class'] }
>()
const delegatedProps = reactiveOmit(props, 'class', 'inset')
const forwarded = useForwardProps(delegatedProps)
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
    <ChevronRight class="ms-auto size-4 rtl:rotate-180" aria-hidden="true" />
  </DropdownMenuSubTrigger>
</template>
