<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { NumberFieldIncrementProps } from "reka-ui"
import { NumberFieldIncrement, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"
import { IconPlaceholder } from "@/registry/bases/reka/components/icon-placeholder"

const props = defineProps<
  NumberFieldIncrementProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <NumberFieldIncrement
    data-slot="increment"
    v-bind="forwarded"
    :class="
      cn(
        'absolute top-1/2 right-0 -translate-y-1/2 p-3 disabled:cursor-not-allowed disabled:opacity-20',
        props.class
      )
    "
  >
    <slot>
      <IconPlaceholder
        lucide="PlusIcon"
        tabler="IconPlus"
        hugeicons="Add01Icon"
        phosphor="PlusIcon"
        remixicon="RiAddLine"
        class="h-4 w-4"
      />
    </slot>
  </NumberFieldIncrement>
</template>
