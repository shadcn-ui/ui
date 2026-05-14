"use client"

import * as React from "react"
import { cn } from "@/examples/ark/lib/utils"
import { Field } from "@ark-ui/react/field"

function Input({
  className,
  ...props
}: React.ComponentProps<typeof Field.Input>) {
  return (
    <Field.Input
      data-slot="input"
      className={cn(
        "h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors file:h-6 file:text-sm file:font-medium focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
