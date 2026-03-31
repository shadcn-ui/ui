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
    :class="cn(
      'cn-avatar-group-count ring-background relative flex shrink-0 items-center justify-center ring-2',
      props.class,
    )"
  >
    <slot />
  </div>
</template>
