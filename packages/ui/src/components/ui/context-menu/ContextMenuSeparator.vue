<script setup lang="ts">
import type { ContextMenuSeparatorProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { ContextMenuSeparator, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ContextMenuSeparatorProps & { class?: HTMLAttributes['class'] }>()
const forwarded = useForwardProps(props)
</script>

<template><ContextMenuSeparator v-bind="forwarded" :class="cn('-mx-1 my-1 h-px bg-muted', props.class)" /></template>
