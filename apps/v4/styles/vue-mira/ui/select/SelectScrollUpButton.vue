<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { SelectScrollUpButtonProps } from "reka-ui"
import { SelectScrollUpButton, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"
import IconPlaceholder from "@/components/icon-placeholder/IconPlaceholder.vue"

const props = defineProps<
  SelectScrollUpButtonProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectScrollUpButton
    data-slot="select-scroll-up-button"
    v-bind="forwardedProps"
    :class="cn('cn-select-scroll-up-button', props.class)"
  >
    <slot>
      <IconPlaceholder
        lucide="ChevronUpIcon"
        tabler="IconChevronUp"
        hugeicons="ArrowUp01Icon"
        phosphor="CaretUpIcon"
        remixicon="RiArrowUpSLine"
      />
    </slot>
  </SelectScrollUpButton>
</template>
