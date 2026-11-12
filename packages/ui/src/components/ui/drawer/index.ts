import { defineComponent, h } from 'vue'
import type { Component } from 'vue'
import { DialogPortal, DialogOverlay } from 'radix-vue'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'
import {
  Sheet,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../sheet'
import SheetContent from '../sheet/SheetContent.vue'

export const Drawer = Sheet
export const DrawerTrigger = SheetTrigger
export const DrawerClose = SheetClose
export const DrawerTitle = SheetTitle
export const DrawerDescription = SheetDescription
export const DrawerHeader = SheetHeader
export const DrawerFooter = SheetFooter
export const DrawerPortal = DialogPortal as Component
export const DrawerOverlay = DialogOverlay as Component

export const DrawerContent = defineComponent({
  name: 'DrawerContent',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () =>
      h(
        SheetContent,
        {
          ...attrs,
          side: 'bottom',
          class: cn('max-h-[85vh] overflow-y-auto rounded-t-2xl', attrs.class),
        },
        {
          default: () => [
            h('div', {
              class: 'mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted-foreground/30',
              'aria-hidden': 'true',
            }),
            slots.default?.(),
          ],
        },
      )
  },
})

export const DrawerHandle = createPrimitive(
  'DrawerHandle',
  'span',
  'mx-auto block h-1.5 w-12 rounded-full bg-muted-foreground/30',
  { 'aria-hidden': 'true' },
)
