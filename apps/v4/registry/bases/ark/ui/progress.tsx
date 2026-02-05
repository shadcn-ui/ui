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

function ProgressLabel({
  className,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Label>) {
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      className={cn("cn-progress-label", className)}
      {...props}
    />
  )
}

function ProgressValueText({
  className,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.ValueText>) {
  return (
    <ProgressPrimitive.ValueText
      data-slot="progress-value-text"
      className={cn("cn-progress-value-text", className)}
      {...props}
    />
  )
}

export { Progress, ProgressLabel, ProgressValueText }
