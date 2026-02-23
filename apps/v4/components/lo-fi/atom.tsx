import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const atomVariants = cva(
  "inline-flex rounded-lg border-neutral-300 dark:border-neutral-600",
  {
    variants: {
      shade: {
        "50": "bg-neutral-50 dark:bg-neutral-900",
        "100": "bg-neutral-100 dark:bg-neutral-800",
        "200": "bg-neutral-200 dark:bg-neutral-700",
        "300": "bg-neutral-300 dark:bg-neutral-600",
        "400": "bg-neutral-400 dark:bg-neutral-500",
        "500": "bg-neutral-500 dark:bg-neutral-400",
        "600": "bg-neutral-600 dark:bg-neutral-300",
        "700": "bg-neutral-700 dark:bg-neutral-200",
        "800": "bg-neutral-800 dark:bg-neutral-100",
        "900": "bg-neutral-900 dark:bg-neutral-50",
      },
    },
    defaultVariants: {
      shade: "50",
    },
  }
)

function Atom({
  className,
  shade,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof atomVariants>) {
  return (
    <div
      data-slot="button"
      className={cn(atomVariants({ shade, className }))}
      {...props}
    />
  )
}

export { Atom }
