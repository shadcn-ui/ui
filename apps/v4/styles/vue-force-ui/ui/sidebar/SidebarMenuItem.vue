<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <li
    data-slot="sidebar-menu-item"
    data-sidebar="menu-item"
    :class="cn('group/menu-item relative', props.class)"
  >
    <slot />
    <!-- [FORCE-UI] active-state accent indicator, see style-force-ui.css -->
    <span aria-hidden="true" class="cn-sidebar-menu-item-indicator" />
  </li>
</template>
