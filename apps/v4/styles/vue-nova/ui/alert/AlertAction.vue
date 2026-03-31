<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div data-slot="alert-action" :class="cn('cn-alert-action', props.class)">
    <slot />
  </div>
</template>
