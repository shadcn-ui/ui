<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { PrimitiveProps } from "reka-ui"
import { Primitive, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  PrimitiveProps & { class?: HTMLAttributes["class"] }
>()
const delegatedProps = reactiveOmit(props, "class")
const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <Primitive
    data-slot="pin-input-group"
    v-bind="forwardedProps"
    :class="cn('flex items-center', props.class)"
  >
    <slot />
  </Primitive>
</template>
