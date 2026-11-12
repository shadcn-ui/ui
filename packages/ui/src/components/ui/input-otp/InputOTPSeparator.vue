<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Minus } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div role="separator" :class="cn('text-muted-foreground', $props.class)">
    <slot><Minus class="size-4" aria-hidden="true" /></slot>
  </div>
</template>
