<script setup lang="ts">
import type { ButtonVariants } from "@/ui/button"
import { buttonVariants } from "@/ui/button"
import { reactiveOmit } from "@vueuse/core"
import type { PaginationFirstProps } from "reka-ui"
import { PaginationFirst, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"
import { IconPlaceholder } from "@/components/icon-placeholder"

const props = withDefaults(
  defineProps<
    PaginationFirstProps & {
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
  <PaginationFirst
    data-slot="pagination-first"
    :class="
      cn(
        buttonVariants({ variant: 'ghost', size }),
        'cn-pagination-first',
        props.class
      )
    "
    v-bind="forwarded"
  >
    <slot>
      <IconPlaceholder
        lucide="ChevronsLeftIcon"
        tabler="IconChevronsLeft"
        hugeicons="ArrowLeftDoubleIcon"
        phosphor="CaretDoubleLeftIcon"
        remixicon="RiArrowLeftDoubleLine"
        data-icon="inline-start"
      />
      <span class="cn-pagination-first-text hidden sm:block">First</span>
    </slot>
  </PaginationFirst>
</template>
