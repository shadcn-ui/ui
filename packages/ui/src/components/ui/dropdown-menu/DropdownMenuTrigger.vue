<script setup lang="ts">
import { DropdownMenuTrigger, type DropdownMenuTriggerProps, useForwardProps } from 'radix-vue'

const props = defineProps<DropdownMenuTriggerProps>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DropdownMenuTrigger v-bind="forwarded">
    <slot />
  </DropdownMenuTrigger>
</template>
