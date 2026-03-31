<script lang="ts" setup>
import { reactiveOmit } from "@vueuse/core"
import type { RangeCalendarPrevProps } from "reka-ui"
import { RangeCalendarPrev, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"
import { IconPlaceholder } from "@/registry/bases/reka/components/icon-placeholder"
import { buttonVariants } from "@/registry/new-york-v4/ui/button"

const props = defineProps<
  RangeCalendarPrevProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RangeCalendarPrev
    data-slot="range-calendar-prev-button"
    :class="
      cn(
        buttonVariants({ variant: 'outline' }),
        'absolute left-1',
        'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        props.class
      )
    "
    v-bind="forwardedProps"
  >
    <slot>
      <IconPlaceholder
        lucide="ChevronLeftIcon"
        tabler="IconChevronLeft"
        hugeicons="ArrowLeft01Icon"
        phosphor="CaretLeftIcon"
        remixicon="RiArrowLeftSLine"
        class="size-4"
      />
    </slot>
  </RangeCalendarPrev>
</template>
