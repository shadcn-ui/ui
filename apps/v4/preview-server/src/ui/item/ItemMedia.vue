<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { ItemMediaVariants } from "."
import { cn } from "@/lib/utils"
import { itemMediaVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  variant?: ItemMediaVariants["variant"]
}>()
</script>

<template>
  <div
    data-slot="item-media"
    :data-variant="props.variant"
    :class="cn(itemMediaVariants({ variant }), props.class)"
  >
    <slot />
  </div>
</template>
