<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { SplitterGroupEmits, SplitterGroupProps } from "reka-ui"
import { SplitterGroup, useForwardPropsEmits } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  SplitterGroupProps & { class?: HTMLAttributes["class"] }
>()
const emits = defineEmits<SplitterGroupEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SplitterGroup
    v-slot="slotProps"
    data-slot="resizable-panel-group"
    v-bind="forwarded"
    :class="
      cn(
        'cn-resizable-panel-group flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
        props.class
      )
    "
  >
    <slot v-bind="slotProps" />
  </SplitterGroup>
</template>
