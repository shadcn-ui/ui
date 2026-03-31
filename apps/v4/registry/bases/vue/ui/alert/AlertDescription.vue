<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="alert-description"
    :class="cn('cn-alert-description [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3', props.class)"
  >
    <slot />
  </div>
</template>
