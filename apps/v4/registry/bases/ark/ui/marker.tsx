import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/bases/ark/lib/utils"

const markerVariants = cva(
  "cn-marker group/marker relative flex w-full items-center",
  {
    variants: {
      variant: {
        default: "cn-marker-variant-default",
        separator: "cn-marker-variant-separator",
        border: "cn-marker-variant-border",
      },
    },
  }
)

function Marker({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<typeof ark.div> &
  VariantProps<typeof markerVariants> & {
    asChild?: boolean
  }) {
  return (
    <ark.div
      asChild={asChild}
      data-slot="marker"
      data-variant={variant}
      className={cn(markerVariants({ variant, className }))}
      {...props}
    />
  )
}

function MarkerIcon({ className, ...props }: React.ComponentProps<typeof ark.span>) {
  return (
    <ark.span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn("cn-marker-icon shrink-0", className)}
      {...props}
    />
  )
}

function MarkerContent({ className, ...props }: React.ComponentProps<typeof ark.span>) {
  return (
    <ark.span
      data-slot="marker-content"
      className={cn("cn-marker-content min-w-0 wrap-break-word", className)}
      {...props}
    />
  )
}

export { Marker, MarkerIcon, MarkerContent, markerVariants }
