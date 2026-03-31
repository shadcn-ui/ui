import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Alert } from "./Alert.vue"
export { default as AlertAction } from "./AlertAction.vue"
export { default as AlertDescription } from "./AlertDescription.vue"
export { default as AlertTitle } from "./AlertTitle.vue"

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
