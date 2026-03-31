<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { PaginationEllipsisProps } from "reka-ui"
import { PaginationEllipsis } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"
import IconPlaceholder from "@/components/icon-placeholder/IconPlaceholder.vue"

const props = defineProps<
  PaginationEllipsisProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <PaginationEllipsis
    data-slot="pagination-ellipsis"
    v-bind="delegatedProps"
    :class="
      cn('cn-pagination-ellipsis flex items-center justify-center', props.class)
    "
  >
    <slot>
      <IconPlaceholder
        lucide="MoreHorizontalIcon"
        tabler="IconDots"
        hugeicons="MoreHorizontalCircle01Icon"
        phosphor="DotsThreeIcon"
        remixicon="RiMoreLine"
      />
      <span class="sr-only">More pages</span>
    </slot>
  </PaginationEllipsis>
</template>
