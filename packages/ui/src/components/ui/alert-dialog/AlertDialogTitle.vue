<script setup lang="ts">
import type { AlertDialogTitleProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { AlertDialogTitle } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<AlertDialogTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogTitle v-bind="delegatedProps" :class="cn('text-lg font-semibold', props.class)">
    <slot />
  </AlertDialogTitle>
</template>
