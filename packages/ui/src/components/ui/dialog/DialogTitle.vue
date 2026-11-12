<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DialogTitle, type DialogTitleProps, useForwardProps } from 'radix-vue'
import { reactiveOmit } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<DialogTitleProps & { class?: HTMLAttributes['class'] }>()
const forwarded = useForwardProps(reactiveOmit(props, 'class'))
</script>

<template>
  <DialogTitle v-bind="forwarded" :class="cn('text-lg font-semibold leading-none', props.class)">
    <slot />
  </DialogTitle>
</template>
