<script lang="ts" setup>
import { buttonVariants } from "@/ui/button"
import { reactiveOmit } from "@vueuse/core"
import type { CalendarNextProps } from "reka-ui"
import { CalendarNext, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"
import { IconPlaceholder } from "@/components/icon-placeholder"

const props = defineProps<
  CalendarNextProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <CalendarNext
    data-slot="calendar-next-button"
    :class="
      cn(
        buttonVariants({ variant: 'outline' }),
        'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        props.class
      )
    "
    v-bind="forwardedProps"
  >
    <slot>
      <IconPlaceholder
        lucide="ChevronRightIcon"
        tabler="IconChevronRight"
        hugeicons="ArrowRight01Icon"
        phosphor="CaretRightIcon"
        remixicon="RiArrowRightSLine"
        class="size-4"
      />
    </slot>
  </CalendarNext>
</template>
