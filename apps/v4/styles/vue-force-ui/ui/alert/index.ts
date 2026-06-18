import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Alert } from "./Alert.vue"
export { default as AlertAction } from "./AlertAction.vue"
export { default as AlertDescription } from "./AlertDescription.vue"
export { default as AlertTitle } from "./AlertTitle.vue"

export const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-error-subtle text-error [&_a]:text-error [&_a]:underline *:[svg]:text-current",
        warning:
          "bg-warning-subtle text-warning [&_a]:text-warning [&_a]:underline *:[svg]:text-current",
        success:
          "bg-success-subtle text-success [&_a]:text-success [&_a]:underline *:[svg]:text-current",
        info: "bg-info-subtle text-info [&_a]:text-info [&_a]:underline *:[svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type AlertVariants = VariantProps<typeof alertVariants>
