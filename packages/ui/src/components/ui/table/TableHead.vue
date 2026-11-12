<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <th :class="cn('h-12 px-4 text-start align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pe-0', $props.class)">
    <slot />
  </th>
</template>
