"use client"

import * as React from "react"

import { cn } from "@/registry/bases/base/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "cn-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
