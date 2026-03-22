"use client"

import * as React from "react"
import { Field } from "@ark-ui/react/field"

import { cn } from "@/registry/ark-vega/lib/utils"

function Textarea({
  className,
  ...props
}: React.ComponentProps<typeof Field.Textarea>) {
  return (
    <Field.Textarea
      data-slot="textarea"
      className={cn("border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] focus-visible:ring-3 aria-invalid:ring-3 md:text-sm w-full", className)}
      {...props}
    />
  )
}

export { Textarea }
