<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="
      cn(
        'grid auto-rows-min grid-rows-[auto_auto] items-start gap-y-1.5 p-6 has-[[data-slot=card-action]]:grid-cols-[1fr_auto]',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
