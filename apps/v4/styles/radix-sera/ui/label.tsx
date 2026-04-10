"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-xs leading-relaxed font-semibold tracking-wide uppercase select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-[slot=checkbox]:text-sm peer-data-[slot=checkbox]:font-medium peer-data-[slot=checkbox]:tracking-normal peer-data-[slot=checkbox]:normal-case peer-data-[slot=radio]:text-sm peer-data-[slot=radio]:font-medium peer-data-[slot=radio]:tracking-normal peer-data-[slot=radio]:normal-case",
        className
      )}
      {...props}
    />
  )
}

export { Label }
