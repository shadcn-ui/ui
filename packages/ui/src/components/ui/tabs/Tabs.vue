<script setup lang="ts">
import type { TabsRootEmits, TabsRootProps } from 'radix-vue'
import { TabsRoot, useForwardPropsEmits } from 'radix-vue'
import { useResolvedDirection } from '@/lib/rtl'

const props = defineProps<TabsRootProps>()
const emits = defineEmits<TabsRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
const dir = useResolvedDirection(() => props.dir)
</script>

<template>
  <TabsRoot v-slot="slotProps" v-bind="forwarded" :dir="dir">
    <slot v-bind="slotProps" />
  </TabsRoot>
</template>
