<script setup lang="ts">
import { DialogTrigger, type DialogTriggerProps, useForwardProps } from 'radix-vue'

const props = defineProps<DialogTriggerProps>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DialogTrigger v-bind="forwarded">
    <slot />
  </DialogTrigger>
</template>
