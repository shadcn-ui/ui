"use client"

import * as React from "react"
import { Field } from "@ark-ui/react/field"

import { cn } from "@/registry/bases/ark/lib/utils"

function Input({ className, ...props }: React.ComponentProps<typeof Field.Input>) {
  return (
    <Field.Input
      data-slot="input"
      className={cn(
        "cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
