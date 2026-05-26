"use client"

import * as React from "react"
import { Field } from "@ark-ui/react/field"

import { cn } from "@/registry/bases/ark/lib/utils"

function Input({ className, ...props }: React.ComponentProps<typeof Field.Input>) {
  return (
    <Field.Input
      data-slot="input"
      className={cn("cn-input", className)}
      {...props}
    />
  )
}

export { Input }
