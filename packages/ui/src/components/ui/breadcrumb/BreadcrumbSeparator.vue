<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ChevronLeft } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <li
    role="presentation"
    aria-hidden="true"
    :class="cn('[&>svg]:size-3.5', $props.class)"
  >
    <slot><ChevronLeft /></slot>
  </li>
</template>
