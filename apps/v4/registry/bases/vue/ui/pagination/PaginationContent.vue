<script setup lang="ts">
import type { PaginationListProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { PaginationList } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<PaginationListProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <PaginationList
    v-slot="slotProps"
    data-slot="pagination-content"
    v-bind="delegatedProps"
    :class="cn('cn-pagination-content flex items-center', props.class)"
  >
    <slot v-bind="slotProps" />
  </PaginationList>
</template>
