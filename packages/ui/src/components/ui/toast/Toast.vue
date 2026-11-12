<script setup lang="ts">
import type { ToastRootEmits } from 'radix-vue'
import type { ToastProps } from '.'
import { reactiveOmit } from '@vueuse/core'
import { ToastRoot, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'
import { toastVariants } from '.'

const props = defineProps<ToastProps>()

const emits = defineEmits<ToastRootEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'variant', 'onOpenChange')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ToastRoot
    v-bind="forwarded"
    :class="cn(toastVariants({ variant }), props.class)"
    @update:open="onOpenChange"
  >
    <slot />
  </ToastRoot>
</template>
