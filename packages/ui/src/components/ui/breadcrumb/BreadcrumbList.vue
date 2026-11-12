<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <ol :class="cn('breadcrumb-list flex list-none flex-wrap items-center gap-1.5 p-0 break-words text-sm text-muted-foreground sm:gap-2.5', $props.class)">
    <slot />
  </ol>
</template>
