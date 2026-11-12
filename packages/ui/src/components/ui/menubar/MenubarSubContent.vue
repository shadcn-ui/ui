<script setup lang="ts">
import type { MenubarSubContentEmits, MenubarSubContentProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { MenubarPortal, MenubarSubContent, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<MenubarSubContentProps & { class?: HTMLAttributes['class'] }>()

const emits = defineEmits<MenubarSubContentEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <MenubarPortal>
    <MenubarSubContent
      v-bind="forwarded"
      :class="
        cn(
          'z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          props.class,
        )
      "
    >
      <slot />
    </MenubarSubContent>
  </MenubarPortal>
</template>
