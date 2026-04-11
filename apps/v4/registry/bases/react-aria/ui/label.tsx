"use client"

import * as React from "react"
import { Label as LabelPrimitive, type LabelProps } from "react-aria-components"

import { cn } from "@/registry/bases/react-aria/lib/utils"

function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive
      data-slot="label"
      className={cn(
        "cn-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className
      )}
      {...props}
      // @ts-expect-error TODO: LabelProps are incorrect
      slot={props.slot ?? (props.htmlFor ? null : undefined)}
    />
  )
}

export { Label }
