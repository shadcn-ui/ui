<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div data-slot="popover-header" :class="cn('cn-popover-header', props.class)">
    <slot />
  </div>
</template>
