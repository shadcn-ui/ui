<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <span
    data-slot="command-shortcut"
    :class="cn('cn-command-shortcut', props.class)"
  >
    <slot />
  </span>
</template>
