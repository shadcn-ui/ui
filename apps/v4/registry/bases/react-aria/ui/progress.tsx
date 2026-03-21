"use client"

import * as React from "react"
import {
  ProgressBar as ProgressPrimitive,
  type ProgressBarProps as ProgressPrimitiveProps,
} from "react-aria-components"

import { cn } from "@/registry/bases/react-aria/lib/utils"

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
      className={cn("cn-progress-root flex flex-wrap gap-3", className)}
      {...props}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          {label ? (
            <span
              className={cn("cn-progress-label")}
              data-slot="progress-label"
            >
              {label}
            </span>
          ) : null}
          {showValueLabel ? (
            <span
              className={cn("cn-progress-value")}
              data-slot="progress-value"
            >
              {valueText}
            </span>
          ) : null}
          <span
            className={cn(
              "cn-progress-track relative flex w-full items-center overflow-x-hidden"
            )}
            data-slot="progress-track"
          >
            <span
              data-slot="progress-indicator"
              className={cn("cn-progress-indicator h-full transition-all")}
              style={{ width: `${isIndeterminate ? 100 : percentage}%` }}
            />
          </span>
        </>
      )}
    </ProgressPrimitive>
  )
}

export { Progress }
