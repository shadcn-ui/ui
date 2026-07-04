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
        // [FORCE-UI] pulse the indicator when indeterminate (no value); WCAG 2.3.3 reduced-motion guard
        className="cn-progress-indicator size-full flex-1 transition-all motion-reduce:transition-none data-[state=indeterminate]:animate-pulse motion-reduce:data-[state=indeterminate]:animate-none"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
