<script setup lang="ts">
import type { ContextMenuLabelProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ContextMenuLabel, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<
  ContextMenuLabelProps & { inset?: boolean; class?: HTMLAttributes['class'] }
>()
const forwarded = useForwardProps(reactiveOmit(props, 'class', 'inset'))
</script>

<template>
  <ContextMenuLabel
    v-bind="forwarded"
    :class="cn('px-2 py-1.5 text-sm font-semibold', inset && 'ps-8', props.class)"
    ><slot
  /></ContextMenuLabel>
</template>
