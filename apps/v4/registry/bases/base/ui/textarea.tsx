import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/bases/base/lib/utils"

const textareaVariants = cva(
  "cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        outline: "cn-textarea-variant-outline", // [FORCE-UI]
        filled: "cn-textarea-variant-filled", // [FORCE-UI]
        underline: "cn-textarea-variant-underline", // [FORCE-UI]
        ghost: "cn-textarea-variant-ghost", // [FORCE-UI]
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
)

function Textarea({
  className,
  variant,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Textarea, textareaVariants }
