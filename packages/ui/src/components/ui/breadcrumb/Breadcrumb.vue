<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

defineProps<{ class?: HTMLAttributes['class']; ariaLabel?: string }>()
</script>

<template>
  <nav :aria-label="ariaLabel ?? 'مسیر راهنما'" :class="cn('w-full', $props.class)">
    <slot />
  </nav>
</template>
