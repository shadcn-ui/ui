<script setup lang="ts">
import type { PopoverTriggerProps } from 'radix-vue'
import { PopoverTrigger } from 'radix-vue'

const props = defineProps<PopoverTriggerProps>()
</script>

<template>
  <PopoverTrigger v-bind="props">
    <slot />
  </PopoverTrigger>
</template>
