<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { AccordionItemProps } from "reka-ui"
import { AccordionItem, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  AccordionItemProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <AccordionItem
    v-slot="slotProps"
    data-slot="accordion-item"
    v-bind="forwardedProps"
    :class="cn('cn-accordion-item', props.class)"
  >
    <slot v-bind="slotProps" />
  </AccordionItem>
</template>
