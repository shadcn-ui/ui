"use client"

import * as React from "react"
import { Field } from "@ark-ui/react/field"

import { cn } from "@/registry/bases/ark/lib/utils"

function Textarea({
  className,
  ...props
}: React.ComponentProps<typeof Field.Textarea>) {
  return (
    <Field.Textarea
      data-slot="textarea"
      className={cn("cn-textarea", className)}
      {...props}
    />
  )
}

export { Textarea }
