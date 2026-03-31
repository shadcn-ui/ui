<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <thead data-slot="table-header" :class="cn('cn-table-header', props.class)">
    <slot />
  </thead>
</template>
