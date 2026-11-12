<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <caption :class="cn('mt-4 text-sm text-muted-foreground', $props.class)">
    <slot />
  </caption>
</template>
