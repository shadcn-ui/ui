<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <td data-slot="table-cell" :class="cn('cn-table-cell', props.class)">
    <slot />
  </td>
</template>
