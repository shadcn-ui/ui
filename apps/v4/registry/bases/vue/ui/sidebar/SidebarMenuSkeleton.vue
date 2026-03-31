<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { computed } from "vue"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/ui/skeleton"

const props = defineProps<{
  showIcon?: boolean
  class?: HTMLAttributes["class"]
}>()

const width = computed(() => {
  return `${Math.floor(Math.random() * 40) + 50}%`
})
</script>

<template>
  <div
    data-slot="sidebar-menu-skeleton"
    data-sidebar="menu-skeleton"
    :class="cn('cn-sidebar-menu-skeleton flex items-center', props.class)"
  >
    <Skeleton
      v-if="showIcon"
      class="cn-sidebar-menu-skeleton-icon"
      data-sidebar="menu-skeleton-icon"
    />

    <Skeleton
      class="cn-sidebar-menu-skeleton-text max-w-(--skeleton-width) flex-1"
      data-sidebar="menu-skeleton-text"
      :style="{ '--skeleton-width': width }"
    />
  </div>
</template>
