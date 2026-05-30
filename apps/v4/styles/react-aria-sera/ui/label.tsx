"use client"

import * as React from "react"
import { Label as LabelPrimitive, type LabelProps } from "react-aria-components"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-xs font-semibold tracking-wide uppercase select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-[slot=checkbox]:text-sm peer-data-[slot=checkbox]:font-normal peer-data-[slot=checkbox]:tracking-normal peer-data-[slot=checkbox]:normal-case peer-data-[slot=radio-group-item]:text-sm peer-data-[slot=radio-group-item]:font-normal peer-data-[slot=radio-group-item]:tracking-normal peer-data-[slot=radio-group-item]:normal-case peer-data-[slot=switch]:text-sm peer-data-[slot=switch]:font-normal peer-data-[slot=switch]:tracking-normal peer-data-[slot=switch]:normal-case",
        className
      )}
      {...props}
      // @ts-expect-error TODO: LabelProps are incorrect
      slot={props.slot ?? (props.htmlFor ? null : undefined)}
    />
  )
}

export { Label }
