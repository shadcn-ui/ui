<script setup lang="ts">
import type { AlertDialogActionProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { AlertDialogAction } from 'radix-vue'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const props = defineProps<AlertDialogActionProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogAction v-bind="delegatedProps" :class="cn(buttonVariants(), props.class)">
    <slot>تأیید</slot>
  </AlertDialogAction>
</template>
