<script setup lang="ts">
import type { MenubarSubTriggerProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ChevronRight } from 'lucide-vue-next'
import { MenubarSubTrigger, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<
  MenubarSubTriggerProps & { class?: HTMLAttributes['class']; inset?: boolean }
>()

const delegatedProps = reactiveOmit(props, 'class', 'inset')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <MenubarSubTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        inset && 'ps-8',
        props.class,
      )
    "
  >
    <slot />
    <ChevronRight class="ms-auto h-4 w-4 rtl:rotate-180" />
  </MenubarSubTrigger>
</template>
