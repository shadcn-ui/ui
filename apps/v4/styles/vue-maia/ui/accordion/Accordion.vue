<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { AccordionRootEmits, AccordionRootProps } from "reka-ui"
import { AccordionRoot, useForwardPropsEmits } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  AccordionRootProps & { class?: HTMLAttributes["class"] }
>()
const emits = defineEmits<AccordionRootEmits>()

const delegatedProps = reactiveOmit(props, "class")
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <AccordionRoot
    v-slot="slotProps"
    data-slot="accordion"
    v-bind="forwarded"
    :class="cn('cn-accordion flex w-full flex-col', props.class)"
  >
    <slot v-bind="slotProps" />
  </AccordionRoot>
</template>
