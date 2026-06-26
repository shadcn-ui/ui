<script setup lang="ts">
import { computed } from "vue"

import { materialSymbols } from "@/components/material-symbols"

// [FORCE-UI] Preview defaults to Material Symbols (@material-symbols/svg-400,
// rounded) resolved from the generated inline registry.
const props = defineProps<{
  lucide?: string
  tabler?: string
  hugeicons?: string
  phosphor?: string
  remixicon?: string
  materialSymbols?: string
}>()

const Icon = computed(() =>
  props.materialSymbols ? materialSymbols[props.materialSymbols] : undefined
)
</script>

<template>
  <component :is="Icon" v-if="Icon" v-bind="$attrs" />
</template>
