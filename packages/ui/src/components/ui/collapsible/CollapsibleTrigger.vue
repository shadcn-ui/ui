<script setup lang="ts">
import type { CollapsibleTriggerProps } from 'radix-vue'
import { CollapsibleTrigger } from 'radix-vue'

const props = defineProps<CollapsibleTriggerProps>()
</script>

<template>
  <CollapsibleTrigger v-bind="props">
    <slot />
  </CollapsibleTrigger>
</template>
