import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Sheet } from './Sheet.vue'
export { default as SheetClose } from './SheetClose.vue'
export { default as SheetContent } from './SheetContent.vue'
export { default as SheetDescription } from './SheetDescription.vue'
export { default as SheetFooter } from './SheetFooter.vue'
export { default as SheetHeader } from './SheetHeader.vue'
export { default as SheetTitle } from './SheetTitle.vue'
export { default as SheetTrigger } from './SheetTrigger.vue'

export const sheetVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:animate-in data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom',
        start:
          'inset-y-0 start-0 h-full w-3/4 border-e data-[state=closed]:animate-saaze-slide-out-to-start data-[state=open]:animate-saaze-slide-in-from-start sm:max-w-sm',
        end: 'inset-y-0 end-0 h-full w-3/4 border-s data-[state=closed]:animate-saaze-slide-out-to-end data-[state=open]:animate-saaze-slide-in-from-end sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'end',
    },
  },
)

export type SheetVariants = VariantProps<typeof sheetVariants>
export type SheetSide = NonNullable<SheetVariants['side']> | 'left' | 'right'
