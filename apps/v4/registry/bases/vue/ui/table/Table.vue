<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div data-slot="table-container" class="cn-table-container">
    <table data-slot="table" :class="cn('cn-table', props.class)">
      <slot />
    </table>
  </div>
</template>
