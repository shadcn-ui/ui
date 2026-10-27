import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const textVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive",
      muted: "text-muted-foreground",
      accent: "text-accent-foreground",
    },
    size: {
      xs: "text-xs leading-tight",
      sm: "text-sm leading-snug",
      default: "text-base leading-normal",
      lg: "text-lg leading-relaxed",
      xl: "text-xl leading-relaxed",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function Text({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"p"> &
  VariantProps<typeof textVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "p"

  return (
    <Comp
      data-slot="text"
      data-variant={variant}
      data-size={size}
      className={cn(textVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Text, textVariants }
