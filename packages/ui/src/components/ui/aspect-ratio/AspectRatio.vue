<script setup lang="ts">
import type { AspectRatioProps } from 'radix-vue'
import { AspectRatio } from 'radix-vue'

const props = defineProps<AspectRatioProps>()
</script>

<template>
  <AspectRatio v-bind="props">
    <slot />
  </AspectRatio>
</template>
