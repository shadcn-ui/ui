"use client"

import * as React from "react"
import {
  Label as LabelPrimitive,
  ProgressBar as ProgressPrimitive,
  type LabelProps,
  type ProgressBarProps as ProgressPrimitiveProps,
} from "react-aria-components"

import { cn } from "@/registry/bases/aria/lib/utils"

const ValueContext = React.createContext<string | undefined>(undefined)
const ProgressContext = React.createContext<{
  percentage?: number
  isIndeterminate: boolean
} | null>(null)

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
      className={cn("cn-progress-root flex flex-wrap gap-3", className)}
      {...props}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <ProgressContext value={{ percentage, isIndeterminate }}>
          <ValueContext value={valueText}>{children}</ValueContext>
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        </ProgressContext>
      )}
    </ProgressPrimitive>
  )
}

function ProgressTrack({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "cn-progress-track relative flex w-full items-center overflow-x-hidden",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  const context = React.useContext(ProgressContext)

  return (
    <span
      data-slot="progress-indicator"
      className={cn("cn-progress-indicator h-full transition-all", className)}
      style={{
        ...style,
        width: `${context?.isIndeterminate ? 100 : (context?.percentage ?? 0)}%`,
      }}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive
      className={cn("cn-progress-label", className)}
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
      className={cn("cn-progress-value", className)}
      data-slot="progress-value"
      {...props}
    >
      {children && value != null ? children(value) : value}
    </span>
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
