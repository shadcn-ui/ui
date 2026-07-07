<script setup lang="ts">
import type { PaginationEllipsisProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { PaginationEllipsis } from "reka-ui"
import { cn } from "@/lib/utils"
import IconPlaceholder from "@/components/icon-placeholder/IconPlaceholder.vue"

const props = defineProps<PaginationEllipsisProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <PaginationEllipsis
    data-slot="pagination-ellipsis"
    role="presentation"
    v-bind="delegatedProps"
    :class="cn('cn-pagination-ellipsis flex items-center justify-center', props.class)"
  >
    <slot>
      <!-- [FORCE-UI] aria-hidden scoped to the icon only — hiding it on the host
           also hid the sr-only label below, a WCAG 4.1.2 defect -->
      <span aria-hidden="true">
        <IconPlaceholder
          lucide="MoreHorizontalIcon"
          materialSymbols="more_horiz"
          tabler="IconDots"
          hugeicons="MoreHorizontalCircle01Icon"
          phosphor="DotsThreeIcon"
          remixicon="RiMoreLine"
        />
      </span>
      <span class="sr-only">More pages</span>
    </slot>
  </PaginationEllipsis>
</template>
