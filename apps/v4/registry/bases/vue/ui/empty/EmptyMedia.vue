<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { EmptyMediaVariants } from "."
import { cn } from "@/lib/utils"
import { emptyMediaVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  variant?: EmptyMediaVariants["variant"]
}>()
</script>

<template>
  <div
    data-slot="empty-icon"
    :data-variant="variant"
    :class="cn(emptyMediaVariants({ variant }), props.class)"
  >
    <slot />
  </div>
</template>
