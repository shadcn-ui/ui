<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import TableCell from "./TableCell.vue"
import TableRow from "./TableRow.vue"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    colspan?: number
  }>(),
  {
    colspan: 1,
  }
)

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <TableRow>
    <TableCell
      :class="
        cn(
          'p-4 align-middle text-sm whitespace-nowrap text-foreground',
          props.class
        )
      "
      v-bind="delegatedProps"
    >
      <div class="flex items-center justify-center py-10">
        <slot />
      </div>
    </TableCell>
  </TableRow>
</template>
