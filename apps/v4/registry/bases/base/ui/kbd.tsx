import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/bases/base/lib/utils"

const kbdVariants = cva(
  "cn-kbd pointer-events-none inline-flex items-center justify-center select-none",
  {
    variants: {
      variant: {
        default: "cn-kbd-variant-default",  // [FORCE-UI]
        primary: "cn-kbd-variant-primary",  // [FORCE-UI]
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Kbd({
  className,
  variant,
  ...props
}: React.ComponentProps<"kbd"> & VariantProps<typeof kbdVariants>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(kbdVariants({ variant }), className)}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("cn-kbd-group inline-flex items-center", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup, kbdVariants }
