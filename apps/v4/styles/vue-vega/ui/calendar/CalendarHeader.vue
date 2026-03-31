<script lang="ts" setup>
import { reactiveOmit } from "@vueuse/core"
import type { CalendarHeaderProps } from "reka-ui"
import { CalendarHeader, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  CalendarHeaderProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <CalendarHeader
    data-slot="calendar-header"
    :class="
      cn(
        'relative flex w-full items-center justify-center px-8 pt-1',
        props.class
      )
    "
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarHeader>
</template>
