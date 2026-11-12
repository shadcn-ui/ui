<script setup lang="ts">
import type { AccordionRootEmits, AccordionRootProps } from 'radix-vue'
import { AccordionRoot, useForwardPropsEmits } from 'radix-vue'
import { useResolvedDirection } from '@/lib/rtl'

const props = defineProps<AccordionRootProps>()
const emits = defineEmits<AccordionRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
const dir = useResolvedDirection(() => props.dir)
</script>

<template>
  <AccordionRoot v-bind="forwarded" :dir="dir">
    <slot />
  </AccordionRoot>
</template>
