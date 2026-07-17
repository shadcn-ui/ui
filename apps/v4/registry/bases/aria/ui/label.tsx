"use client"

import * as React from "react"
import {
  LabelContext,
  Label as LabelPrimitive,
  type LabelProps,
} from "react-aria-components"

import { cn } from "@/registry/bases/aria/lib/utils"

function Label({ className, htmlFor, slot, ...props }: LabelProps) {
  const label = (
    <LabelPrimitive
      data-slot="label"
      className={cn(
        "cn-label cn-label-aria flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className
      )}
      {...props}
      htmlFor={htmlFor}
      slot={slot}
    />
  )

  if (htmlFor && slot === undefined) {
    return <LabelContext.Provider value={null}>{label}</LabelContext.Provider>
  }

  return label
}

export { Label }
