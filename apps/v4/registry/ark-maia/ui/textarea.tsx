"use client"

import * as React from "react"
import { Field } from "@ark-ui/react/field"

import { cn } from "@/registry/ark-maia/lib/utils"

function Textarea({
  className,
  ...props
}: React.ComponentProps<typeof Field.Textarea>) {
  return (
    <Field.Textarea
      data-slot="textarea"
      className={cn("border-input bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 resize-none rounded-xl border px-3 py-3 text-base transition-colors focus-visible:ring-[3px] aria-invalid:ring-[3px] md:text-sm w-full", className)}
      {...props}
    />
  )
}

export { Textarea }
