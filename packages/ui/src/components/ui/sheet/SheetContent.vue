<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { X } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  type DialogContentEmits,
  type DialogContentProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { useSaazeDirection } from '@/lib/rtl'
import { cn } from '@/lib/utils'
import { sheetVariants, type SheetSide } from '.'

interface SheetContentProps extends DialogContentProps {
  class?: HTMLAttributes['class']
  side?: SheetSide
  /** نمایش دکمه بستن در گوشه کشو */
  showCloseButton?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SheetContentProps>(), {
  side: 'end',
  showCloseButton: true,
})

const emits = defineEmits<DialogContentEmits>()
const direction = useSaazeDirection()

/**
 * `left` و `right` به‌عنوان نام‌های فیزیکی برای سازگاری نگه داشته شده‌اند و
 * بر اساس جهت صفحه به لبه منطقی `start` یا `end` تبدیل می‌شوند.
 */
const resolvedSide = computed<'top' | 'bottom' | 'start' | 'end'>(() => {
  if (props.side === 'left') return direction.value === 'rtl' ? 'end' : 'start'
  if (props.side === 'right') return direction.value === 'rtl' ? 'start' : 'end'
  return props.side
})

const delegatedProps = reactiveOmit(props, 'class', 'side', 'showCloseButton')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent
      v-bind="{ ...forwarded, ...$attrs }"
      :dir="direction"
      :class="cn(sheetVariants({ side: resolvedSide }), props.class)"
    >
      <slot />

      <DialogClose
        v-if="showCloseButton"
        class="absolute end-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
      >
        <X class="size-4" aria-hidden="true" />
        <span class="sr-only">بستن</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
