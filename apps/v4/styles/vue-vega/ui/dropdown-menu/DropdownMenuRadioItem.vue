<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type {
  DropdownMenuRadioItemEmits,
  DropdownMenuRadioItemProps,
} from "reka-ui"
import {
  DropdownMenuItemIndicator,
  DropdownMenuRadioItem,
  useForwardPropsEmits,
} from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"
import IconPlaceholder from "@/components/icon-placeholder/IconPlaceholder.vue"

const props = defineProps<
  DropdownMenuRadioItemProps & { class?: HTMLAttributes["class"] }
>()

const emits = defineEmits<DropdownMenuRadioItemEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DropdownMenuRadioItem
    data-slot="dropdown-menu-radio-item"
    v-bind="forwarded"
    :class="
      cn(
        'cn-dropdown-menu-radio-item relative flex cursor-default items-center outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        props.class
      )
    "
  >
    <span
      class="cn-dropdown-menu-item-indicator pointer-events-none"
      data-slot="dropdown-menu-radio-item-indicator"
    >
      <DropdownMenuItemIndicator>
        <slot name="indicator-icon">
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </slot>
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </DropdownMenuRadioItem>
</template>
