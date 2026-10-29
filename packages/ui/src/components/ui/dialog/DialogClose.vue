<script setup lang="ts">
import { DialogClose, type DialogCloseProps, useForwardProps } from 'radix-vue'

const props = defineProps<DialogCloseProps>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DialogClose v-bind="forwarded">
    <slot />
  </DialogClose>
</template>
