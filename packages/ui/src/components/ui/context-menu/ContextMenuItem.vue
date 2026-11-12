<script setup lang="ts">
import type { ContextMenuItemProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ContextMenuItem, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<
  ContextMenuItemProps & {
    inset?: boolean
    variant?: 'default' | 'destructive'
    class?: HTMLAttributes['class']
  }
>()
const delegatedProps = reactiveOmit(props, 'class', 'inset', 'variant')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <ContextMenuItem
    v-bind="forwarded"
    :data-variant="props.variant ?? 'default'"
    :class="
      cn(
        'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
        'data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:[&_svg]:!text-destructive',
        inset && 'ps-8',
        props.class,
      )
    "
  >
    <slot />
  </ContextMenuItem>
</template>
