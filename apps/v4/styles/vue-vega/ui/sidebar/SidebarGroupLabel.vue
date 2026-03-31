<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import { Primitive } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  PrimitiveProps & {
    class?: HTMLAttributes["class"]
  }
>()
</script>

<template>
  <Primitive
    data-slot="sidebar-group-label"
    data-sidebar="group-label"
    :as="as"
    :as-child="asChild"
    :class="
      cn(
        'cn-sidebar-group-label flex shrink-0 items-center outline-hidden [&>svg]:shrink-0',
        props.class
      )
    "
  >
    <slot />
  </Primitive>
</template>
