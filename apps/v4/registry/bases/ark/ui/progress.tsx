"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@ark-ui/react/progress"

import { cn } from "@/registry/bases/ark/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("cn-progress", className)}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Track className="cn-progress-track">
        <ProgressPrimitive.Range className="cn-progress-range" />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

const ProgressContext = ProgressPrimitive.Context
const ProgressRootProvider = ProgressPrimitive.RootProvider

export { Progress, ProgressContext, ProgressRootProvider }
export {
  useProgress,
  useProgressContext,
  type ProgressValueChangeDetails,
} from "@ark-ui/react/progress"
