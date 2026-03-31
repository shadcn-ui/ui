<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="avatar-group-count"
    :class="
      cn(
        'cn-avatar-group-count relative flex shrink-0 items-center justify-center ring-2 ring-background',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
