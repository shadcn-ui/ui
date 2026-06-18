import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

const spinnerVariants = cva("animate-spin", {
  variants: {
    color: {
      default: "", // [FORCE-UI]
      primary: "", // [FORCE-UI]
      onPrimary: "", // [FORCE-UI]
      inherit: "", // [FORCE-UI]
    },
    size: {
      xs: "", // [FORCE-UI]
      sm: "", // [FORCE-UI]
      md: "", // [FORCE-UI]
      lg: "", // [FORCE-UI]
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
