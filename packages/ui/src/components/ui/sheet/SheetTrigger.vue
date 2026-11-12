<script setup lang="ts">
import type { DialogTriggerProps } from 'radix-vue'
import { DialogTrigger } from 'radix-vue'

const props = defineProps<DialogTriggerProps>()
</script>

<template>
  <DialogTrigger v-bind="props">
    <slot />
  </DialogTrigger>
</template>
