<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DropdownMenuSeparator, type DropdownMenuSeparatorProps, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuSeparatorProps & { class?: HTMLAttributes['class'] }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DropdownMenuSeparator v-bind="forwarded" :class="cn('-mx-1 my-1 h-px bg-muted', props.class)" />
</template>
