<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'radix-vue'
import { DialogRoot, useForwardPropsEmits } from 'radix-vue'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DialogRoot v-bind="forwarded">
    <slot />
  </DialogRoot>
</template>
