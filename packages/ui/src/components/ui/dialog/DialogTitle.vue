<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DialogTitle, type DialogTitleProps, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<DialogTitleProps & { class?: HTMLAttributes['class'] }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DialogTitle v-bind="forwarded" :class="cn('text-lg font-semibold leading-none', props.class)">
    <slot />
  </DialogTitle>
</template>
