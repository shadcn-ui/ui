<script setup lang="ts">
import type { SplitterPanelEmits, SplitterPanelProps } from 'radix-vue'
import { SplitterPanel, useForwardPropsEmits } from 'radix-vue'

const props = defineProps<SplitterPanelProps>()
const emits = defineEmits<SplitterPanelEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template><SplitterPanel v-bind="forwarded"><slot /></SplitterPanel></template>
