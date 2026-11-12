<script setup lang="ts">
import type { MenubarRadioItemEmits, MenubarRadioItemProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Circle } from 'lucide-vue-next'
import { MenubarItemIndicator, MenubarRadioItem, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<MenubarRadioItemProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<MenubarRadioItemEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <MenubarRadioItem
    v-bind="forwarded"
    :class="
      cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 ps-8 pe-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class,
      )
    "
  >
    <span class="absolute start-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarItemIndicator>
        <Circle class="size-2 fill-current" />
      </MenubarItemIndicator>
    </span>
    <slot />
  </MenubarRadioItem>
</template>
