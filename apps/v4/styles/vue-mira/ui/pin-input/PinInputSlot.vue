<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { PinInputInputProps } from "reka-ui"
import { PinInputInput, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  PinInputInputProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <PinInputInput
    data-slot="pin-input-slot"
    v-bind="forwardedProps"
    :class="
      cn(
        'relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-center text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md focus:z-10 focus:border-ring focus:ring-[3px] focus:ring-ring/50 aria-invalid:border-destructive focus:aria-invalid:border-destructive focus:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:focus:aria-invalid:ring-destructive/40',
        props.class
      )
    "
  />
</template>
