<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DropdownMenuLabel, type DropdownMenuLabelProps, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<
  DropdownMenuLabelProps & { inset?: boolean; class?: HTMLAttributes['class'] }
>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DropdownMenuLabel
    v-bind="forwarded"
    :class="cn('px-2 py-1.5 text-sm font-semibold', props.inset && 'ps-8', props.class)"
  >
    <slot />
  </DropdownMenuLabel>
</template>
