<script setup lang="ts">
import type { AlertDialogEmits, AlertDialogProps } from 'radix-vue'
import { AlertDialogRoot, useForwardPropsEmits } from 'radix-vue'

const props = defineProps<AlertDialogProps>()
const emits = defineEmits<AlertDialogEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <AlertDialogRoot v-bind="forwarded">
    <slot />
  </AlertDialogRoot>
</template>
