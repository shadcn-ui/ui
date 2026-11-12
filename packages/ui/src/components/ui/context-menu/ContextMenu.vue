<script setup lang="ts">
import type { ContextMenuRootEmits, ContextMenuRootProps } from 'radix-vue'
import { ContextMenuRoot, useForwardPropsEmits } from 'radix-vue'
import { useResolvedDirection } from '@/lib/rtl'

const props = defineProps<ContextMenuRootProps>()
const emits = defineEmits<ContextMenuRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
const dir = useResolvedDirection(() => props.dir)
</script>

<template>
  <ContextMenuRoot v-bind="forwarded" :dir="dir">
    <slot />
  </ContextMenuRoot>
</template>
