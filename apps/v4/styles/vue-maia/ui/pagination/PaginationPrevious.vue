<script setup lang="ts">
import type { ButtonVariants } from "@/ui/button"
import { buttonVariants } from "@/ui/button"
import { reactiveOmit } from "@vueuse/core"
import type { PaginationPrevProps } from "reka-ui"
import { PaginationPrev, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"
import IconPlaceholder from "@/components/icon-placeholder/IconPlaceholder.vue"

const props = withDefaults(
  defineProps<
    PaginationPrevProps & {
      size?: ButtonVariants["size"]
      class?: HTMLAttributes["class"]
    }
  >(),
  {
    size: "default",
  }
)

const delegatedProps = reactiveOmit(props, "class", "size")
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <PaginationPrev
    data-slot="pagination-previous"
    :class="
      cn(
        buttonVariants({ variant: 'ghost', size }),
        'cn-pagination-previous',
        props.class
      )
    "
    v-bind="forwarded"
  >
    <slot>
      <IconPlaceholder
        lucide="ChevronLeftIcon"
        tabler="IconChevronLeft"
        hugeicons="ArrowLeft01Icon"
        phosphor="CaretLeftIcon"
        remixicon="RiArrowLeftSLine"
        data-icon="inline-start"
      />
      <span class="cn-pagination-previous-text hidden sm:block">Previous</span>
    </slot>
  </PaginationPrev>
</template>
