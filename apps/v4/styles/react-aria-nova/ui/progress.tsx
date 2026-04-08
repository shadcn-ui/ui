"use client"

import * as React from "react"
import {
  Label as LabelPrimitive,
  ProgressBar as ProgressPrimitive,
  type LabelProps,
  type ProgressBarProps as ProgressPrimitiveProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

const ValueContext = React.createContext<string | undefined>(undefined)

function Progress({
  className,
  children,
  ...props
}: Omit<ProgressPrimitiveProps, "children" | "className"> & {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <ProgressPrimitive
      data-slot="progress"
      className={cn("flex flex-wrap gap-3", className)}
      {...props}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          <ValueContext value={valueText}>{children}</ValueContext>
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

function ProgressLabel({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive
      className={cn("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  children?: (value: string) => React.ReactNode
}) {
  const value = React.useContext(ValueContext)
  return (
    <span
      className={cn(
        "ml-auto text-sm text-muted-foreground tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    >
      {children && value != null ? children(value) : value}
    </span>
  )
}

export { Progress, ProgressLabel, ProgressValue }
