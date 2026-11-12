<script setup lang="ts">
import type { AlertDialogDescriptionProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { AlertDialogDescription } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<AlertDialogDescriptionProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogDescription
    v-bind="delegatedProps"
    :class="cn('text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </AlertDialogDescription>
</template>
