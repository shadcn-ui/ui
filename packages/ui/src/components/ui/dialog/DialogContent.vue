<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from 'radix-vue'
import { reactiveOmit } from '@vueuse/core'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useSaazeDirection } from '@/lib/rtl'
import DialogClose from './DialogClose.vue'

const props = withDefaults(
  defineProps<
    DialogContentProps & {
      class?: HTMLAttributes['class']
      /** نمایش دکمه بستن در گوشه دیالوگ */
      showCloseButton?: boolean
    }
  >(),
  { showCloseButton: true },
)
const emits = defineEmits<DialogContentEmits>()
const delegatedProps = reactiveOmit(props, 'class', 'showCloseButton')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
// محتوا به body پورتال می‌شود؛ جهت را صریحاً روی آن می‌گذاریم.
const direction = useSaazeDirection()
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent
      v-bind="forwarded"
      :dir="direction"
      :class="
        cn(
          'fixed inset-x-0 top-1/2 z-50 mx-auto grid w-[calc(100%-2rem)] max-h-[calc(100svh-2rem)] max-w-lg -translate-y-1/2 gap-4 overflow-y-auto border bg-background p-6 shadow-lg sm:rounded-lg',
          'duration-200',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]',
          props.class,
        )
      "
    >
      <slot />
      <DialogClose
        v-if="showCloseButton"
        class="absolute end-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
      >
        <X class="size-4" aria-hidden="true" />
        <span class="sr-only">بستن</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
