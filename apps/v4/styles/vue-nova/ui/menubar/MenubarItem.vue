<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { MenubarItemEmits, MenubarItemProps } from "reka-ui"
import { MenubarItem, useForwardPropsEmits } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  MenubarItemProps & {
    class?: HTMLAttributes["class"]
    inset?: boolean
    variant?: "default" | "destructive"
  }
>()

const emits = defineEmits<MenubarItemEmits>()

const delegatedProps = reactiveOmit(props, "class", "inset", "variant")
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <MenubarItem
    data-slot="menubar-item"
    :data-inset="inset ? '' : undefined"
    :data-variant="variant"
    v-bind="forwarded"
    :class="
      cn(
        'cn-menubar-item group/menubar-item relative flex cursor-default items-center outline-hidden select-none data-[disabled]:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
        props.class
      )
    "
  >
    <slot />
  </MenubarItem>
</template>
