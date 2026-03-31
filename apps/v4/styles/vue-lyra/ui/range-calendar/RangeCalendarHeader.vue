<script lang="ts" setup>
import { reactiveOmit } from "@vueuse/core"
import type { RangeCalendarHeaderProps } from "reka-ui"
import { RangeCalendarHeader, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  RangeCalendarHeaderProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RangeCalendarHeader
    data-slot="range-calendar-header"
    :class="
      cn('relative flex w-full items-center justify-center pt-1', props.class)
    "
    v-bind="forwardedProps"
  >
    <slot />
  </RangeCalendarHeader>
</template>
