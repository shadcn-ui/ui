<script setup lang="ts">
import type { ToastCloseProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { X } from 'lucide-vue-next'
import { ToastClose } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<
  ToastCloseProps & {
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <ToastClose
    v-bind="delegatedProps"
    :class="
      cn(
        'absolute end-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
        props.class,
      )
    "
  >
    <X class="size-4" aria-hidden="true" />
    <span class="sr-only">بستن</span>
  </ToastClose>
</template>
