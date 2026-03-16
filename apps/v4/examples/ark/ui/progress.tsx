"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@ark-ui/react/progress"

import { cn } from "@/examples/ark/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("h-1 rounded-full bg-muted", className)}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Track className="h-1 rounded-full bg-muted">
        <ProgressPrimitive.Range className="" />
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
      className={cn("text-sm font-medium", className)}
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
      className={cn(className)}
      {...props}
    />
  )
}

export { Progress, ProgressLabel, ProgressValueText }
