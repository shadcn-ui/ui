"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/registry/bases/radix/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "cn-progress relative flex w-full items-center overflow-x-hidden",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="cn-progress-indicator size-full flex-1 transition-all data-[state=indeterminate]:shimmer"
        style={
          value != null
            ? { transform: `translateX(-${100 - value}%)` }
            : undefined
        }
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
