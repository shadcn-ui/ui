import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/bases/base/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const spinnerVariants = cva("cn-spinner animate-spin", {
  variants: {
    color: {
      default: "cn-spinner-color-default", // [FORCE-UI]
      primary: "cn-spinner-color-primary", // [FORCE-UI]
      onPrimary: "cn-spinner-color-onPrimary", // [FORCE-UI]
      inherit: "cn-spinner-color-inherit", // [FORCE-UI]
    },
    size: {
      xs: "cn-spinner-size-xs", // [FORCE-UI]
      sm: "cn-spinner-size-sm", // [FORCE-UI]
      md: "cn-spinner-size-md", // [FORCE-UI]
      lg: "cn-spinner-size-lg", // [FORCE-UI]
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
    <IconPlaceholder
      lucide="Loader2Icon"
      tabler="IconLoader"
      hugeicons="Loading03Icon"
      phosphor="SpinnerIcon"
      remixicon="RiLoaderLine"
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ color, size }), className)}
      {...props}
    />
  )
}

export { Spinner, spinnerVariants }
