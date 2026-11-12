<script setup lang="ts">
import type { ComboboxRootEmits, ComboboxRootProps } from 'radix-vue'
import { ComboboxRoot, useForwardPropsEmits } from 'radix-vue'
import { useResolvedDirection } from '@/lib/rtl'

const props = defineProps<ComboboxRootProps>()
const emits = defineEmits<ComboboxRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
const dir = useResolvedDirection(() => props.dir)
</script>

<template>
  <ComboboxRoot v-slot="slotProps" v-bind="forwarded" :dir="dir">
    <slot v-bind="slotProps" />
  </ComboboxRoot>
</template>
