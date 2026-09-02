import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/registry/bases/radix/lib/utils"
import { badgeVariants, type BadgeVariants } from "@/registry/bases/radix/ui/badge-variants"

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & BadgeVariants & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
