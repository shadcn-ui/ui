<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import { Primitive } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      size?: "sm" | "md"
      isActive?: boolean
      class?: HTMLAttributes["class"]
    }
  >(),
  {
    as: "a",
    size: "md",
  }
)
</script>

<template>
  <Primitive
    data-slot="sidebar-menu-sub-button"
    data-sidebar="menu-sub-button"
    :as="as"
    :as-child="asChild"
    :data-size="size"
    :data-active="isActive"
    :class="
      cn(
        'cn-sidebar-menu-sub-button flex min-w-0 -translate-x-px items-center overflow-hidden outline-hidden group-data-[collapsible=icon]:hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0',
        props.class
      )
    "
  >
    <slot />
  </Primitive>
</template>
