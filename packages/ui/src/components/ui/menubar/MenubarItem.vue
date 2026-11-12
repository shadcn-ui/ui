<script setup lang="ts">
import type { MenubarItemEmits, MenubarItemProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { MenubarItem, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<MenubarItemProps & { class?: HTMLAttributes['class']; inset?: boolean }>()

const emits = defineEmits<MenubarItemEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'inset')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <MenubarItem
    v-bind="forwarded"
    :class="
      cn(
        'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
        inset && 'ps-8',
        props.class,
      )
    "
  >
    <slot />
  </MenubarItem>
</template>
