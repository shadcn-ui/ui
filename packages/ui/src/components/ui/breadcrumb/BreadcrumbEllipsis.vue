<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { MoreHorizontal } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

defineProps<{ class?: HTMLAttributes['class']; label?: string }>()
</script>

<template>
  <span
    role="presentation"
    aria-hidden="true"
    :class="cn('flex size-9 items-center justify-center', $props.class)"
  >
    <slot><MoreHorizontal class="size-4" /></slot>
    <span class="sr-only">{{ label ?? 'بیشتر' }}</span>
  </span>
</template>
