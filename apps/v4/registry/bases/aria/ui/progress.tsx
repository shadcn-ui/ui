"use client"

import * as React from "react"
import {
  Label as LabelPrimitive,
  ProgressBar as ProgressPrimitive,
  type LabelProps,
  type ProgressBarProps as ProgressPrimitiveProps,
} from "react-aria-components"

import { cn } from "@/registry/bases/aria/lib/utils"

type ProgressContextValue = {
  percentage?: number
  isIndeterminate: boolean
  valueText?: string
}

const ProgressContext = React.createContext<ProgressContextValue | null>(null)

function useProgress() {
  const context = React.useContext(ProgressContext)
  if (!context) {
    throw new Error("useProgress must be used within a Progress.")
  }

  return context
}

function ProgressContent({
  children,
  percentage,
  isIndeterminate,
  valueText,
}: ProgressContextValue & {
  children?: React.ReactNode
}) {
  const context = React.useMemo(
    () => ({ percentage, isIndeterminate, valueText }),
    [percentage, isIndeterminate, valueText]
  )

  return (
    <ProgressContext value={context}>
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressContext>
  )
}

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
        <ProgressContent
          percentage={percentage}
          valueText={valueText}
          isIndeterminate={isIndeterminate}
        >
          {children}
        </ProgressContent>
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
  const { percentage, isIndeterminate } = useProgress()

  return (
    <span
      data-slot="progress-indicator"
      className={cn("cn-progress-indicator h-full transition-all", className)}
      style={{
        ...style,
        width: `${isIndeterminate ? 100 : (percentage ?? 0)}%`,
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
  const { valueText } = useProgress()
  return (
    <span
      className={cn("cn-progress-value", className)}
      data-slot="progress-value"
      {...props}
    >
      {children && valueText != null ? children(valueText) : valueText}
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
