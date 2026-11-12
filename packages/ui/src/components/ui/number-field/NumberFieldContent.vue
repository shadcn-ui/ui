<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div
    data-slot="number-field-content"
    :class="
      cn(
        'relative [&>[data-slot=input]]:has-[[data-slot=decrement]]:ps-9 [&>[data-slot=input]]:has-[[data-slot=increment]]:pe-9',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
