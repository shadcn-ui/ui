<script setup lang="ts">
import type { ToastTitleProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ToastTitle } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ToastTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <ToastTitle
    v-bind="delegatedProps"
    :class="cn('text-sm font-semibold [&+div]:text-xs', props.class)"
  >
    <slot />
  </ToastTitle>
</template>
