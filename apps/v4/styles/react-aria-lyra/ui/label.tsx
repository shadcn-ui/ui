"use client"

import * as React from "react"
import { Label as LabelPrimitive, type LabelProps } from "react-aria-components"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-xs leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-disabled:opacity-50",
        className
      )}
      {...props}
      // @ts-expect-error TODO: LabelProps are incorrect
      slot={props.slot ?? (props.htmlFor ? null : undefined)}
    />
  )
}

export { Label }
