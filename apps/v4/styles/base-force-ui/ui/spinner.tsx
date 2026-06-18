import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

const spinnerVariants = cva("animate-spin", {
  variants: {
    color: {
      default: "text-muted-foreground", // [FORCE-UI]
      primary: "text-primary", // [FORCE-UI]
      onPrimary: "text-primary-foreground", // [FORCE-UI]
      inherit: "text-current", // [FORCE-UI]
    },
    size: {
      xs: "size-3", // [FORCE-UI]
      sm: "size-4", // [FORCE-UI]
      md: "size-6", // [FORCE-UI]
      lg: "size-10", // [FORCE-UI]
    },
  },
  defaultVariants: {
    color: "default",
    size: "sm",
  },
})

function Spinner({
  className,
  color,
  size,
  ...props
}: React.ComponentProps<"svg"> & VariantProps<typeof spinnerVariants>) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ color, size }), className)}
      {...props}
    />
  )
}

export { Spinner, spinnerVariants }
