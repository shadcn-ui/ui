<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { ToggleEmits, ToggleProps } from "reka-ui"
import { Toggle, useForwardPropsEmits } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import type { ToggleVariants } from "."
import { toggleVariants } from "."

const props = withDefaults(
  defineProps<
    ToggleProps & {
      class?: HTMLAttributes["class"]
      variant?: ToggleVariants["variant"]
      size?: ToggleVariants["size"]
    }
  >(),
  {
    variant: "default",
    size: "default",
    disabled: false,
  }
)

const emits = defineEmits<ToggleEmits>()

const delegatedProps = reactiveOmit(props, "class", "size", "variant")
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <Toggle
    v-slot="slotProps"
    data-slot="toggle"
    v-bind="forwarded"
    :class="cn(toggleVariants({ variant, size }), props.class)"
  >
    <slot v-bind="slotProps" />
  </Toggle>
</template>
