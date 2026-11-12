<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'radix-vue'
import { cn } from '@/lib/utils'

withDefaults(defineProps<{ class?: HTMLAttributes['class']; asChild?: boolean }>(), {
  asChild: false,
})
</script>

<template>
  <Primitive
    as="a"
    :as-child="asChild"
    :class="cn('transition-colors hover:text-foreground', $props.class)"
    v-bind="$attrs"
  >
    <slot />
  </Primitive>
</template>
