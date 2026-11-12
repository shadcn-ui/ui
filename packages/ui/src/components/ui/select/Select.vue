<script setup lang="ts">
import type { SelectRootEmits, SelectRootProps } from 'radix-vue'
import { SelectRoot, useForwardPropsEmits } from 'radix-vue'
import { useResolvedDirection } from '@/lib/rtl'

const props = defineProps<SelectRootProps>()
const emits = defineEmits<SelectRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
const dir = useResolvedDirection(() => props.dir)
</script>

<template>
  <SelectRoot v-slot="slotProps" v-bind="forwarded" :dir="dir">
    <slot v-bind="slotProps" />
  </SelectRoot>
</template>
