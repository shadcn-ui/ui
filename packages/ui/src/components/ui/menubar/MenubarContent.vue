<script setup lang="ts">
import type { MenubarContentProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { MenubarContent, MenubarPortal, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<MenubarContentProps & { class?: HTMLAttributes['class'] }>(),
  {
    align: 'start',
    alignOffset: -4,
    sideOffset: 8,
  },
)

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <MenubarPortal>
    <MenubarContent
      v-bind="forwardedProps"
      :class="
        cn(
          'z-50 min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          props.class,
        )
      "
    >
      <slot />
    </MenubarContent>
  </MenubarPortal>
</template>
