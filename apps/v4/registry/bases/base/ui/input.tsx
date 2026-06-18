import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/bases/base/lib/utils"

const inputVariants = cva(
  "cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        outline: "cn-input-variant-outline",     // [FORCE-UI]
        filled: "cn-input-variant-filled",       // [FORCE-UI]
        underline: "cn-input-variant-underline", // [FORCE-UI]
        ghost: "cn-input-variant-ghost",         // [FORCE-UI]
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
)

function Input({
  className,
  type,
  variant,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
