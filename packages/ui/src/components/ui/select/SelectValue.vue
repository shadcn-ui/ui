<script setup lang="ts">
import type { SelectValueProps } from 'radix-vue'
import { SelectValue } from 'radix-vue'

const props = withDefaults(defineProps<SelectValueProps>(), {
  placeholder: 'انتخاب کنید',
})
</script>

<template>
  <SelectValue v-bind="props">
    <slot />
  </SelectValue>
</template>
