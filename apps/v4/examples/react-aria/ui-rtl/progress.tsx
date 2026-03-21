"use client"

import * as React from "react"
import { cn } from "@/examples/react-aria/lib/utils"
import {
  ProgressBar as ProgressPrimitive,
  type ProgressBarProps as ProgressPrimitiveProps,
} from "react-aria-components"

function Progress({
  className,
  label,
  showValueLabel = false,
  ...props
}: Omit<ProgressPrimitiveProps, "children" | "className"> & {
  className?: string
  label?: React.ReactNode
  showValueLabel?: boolean
}) {
  return (
    <ProgressPrimitive
      data-slot="progress"
      className={cn("flex flex-wrap gap-3", className)}
      {...props}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          {label ? (
            <span
              className={cn("text-sm font-medium")}
              data-slot="progress-label"
            >
              {label}
            </span>
          ) : null}
          {showValueLabel ? (
            <span
              className={cn(
                "ms-auto text-sm text-muted-foreground tabular-nums"
              )}
              data-slot="progress-value"
            >
              {valueText}
            </span>
          ) : null}
          <span
            className={cn(
              "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted"
            )}
            data-slot="progress-track"
          >
            <span
              data-slot="progress-indicator"
              className={cn("h-full bg-primary transition-all")}
              style={{ width: `${isIndeterminate ? 100 : percentage}%` }}
            />
          </span>
        </>
      )}
    </ProgressPrimitive>
  )
}

export { Progress }
