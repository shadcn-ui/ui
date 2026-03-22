"use client"

import * as React from "react"
import { Field } from "@ark-ui/react/field"

import { cn } from "@/registry/ark-maia/lib/utils"

function Input({ className, ...props }: React.ComponentProps<typeof Field.Input>) {
  return (
    <Field.Input
      data-slot="input"
      className={cn("bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 rounded-4xl border px-3 py-1 text-base transition-colors file:h-7 file:text-sm file:font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] md:text-sm", className)}
      {...props}
    />
  )
}

export { Input }
