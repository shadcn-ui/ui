<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <span
    role="link"
    aria-current="page"
    aria-disabled="true"
    :class="cn('font-normal text-foreground', $props.class)"
  >
    <slot />
  </span>
</template>
