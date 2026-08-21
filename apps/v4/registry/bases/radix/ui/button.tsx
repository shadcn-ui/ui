import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/registry/bases/radix/lib/utils"
import { buttonVariants, type ButtonVariants } from "@/registry/bases/radix/ui/button-variants"

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  ButtonVariants & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
