<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DialogDescription, type DialogDescriptionProps, useForwardProps } from 'radix-vue'
import { reactiveOmit } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<DialogDescriptionProps & { class?: HTMLAttributes['class'] }>()
const forwarded = useForwardProps(reactiveOmit(props, 'class'))
</script>

<template>
  <DialogDescription v-bind="forwarded" :class="cn('text-sm text-muted-foreground', props.class)">
    <slot />
  </DialogDescription>
</template>
