import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"



export const alertVariants = cva("cn-alert w-full relative group/alert", {
  variants: {
    variant: {
      default: "cn-alert-variant-default",
      destructive: "cn-alert-variant-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export type AlertVariants = VariantProps<typeof alertVariants>
