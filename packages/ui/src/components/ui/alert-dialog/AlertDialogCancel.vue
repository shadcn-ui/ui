<script setup lang="ts">
import type { AlertDialogCancelProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { AlertDialogCancel } from 'radix-vue'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const props = defineProps<AlertDialogCancelProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogCancel
    v-bind="delegatedProps"
    :class="cn(buttonVariants({ variant: 'outline' }), props.class)"
  >
    <slot>انصراف</slot>
  </AlertDialogCancel>
</template>
