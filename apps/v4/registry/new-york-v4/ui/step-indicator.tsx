"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/* -----------------------------------------------------------------------------
 * StepIndicator Props
 * -------------------------------------------------------------------------- */

export interface StepIndicatorProps extends React.ComponentProps<"div"> {
  /** The step index (0-based) */
  index: number
  /** Whether this step is completed */
  isCompleted: boolean
  /** Whether this step is the active step */
  isActive: boolean
  /** Whether this step is upcoming */
  isUpcoming: boolean
  /** Optional custom icon */
  icon?: React.ReactNode
  /** Optional step title for accessibility */
  title?: string
}

/* -----------------------------------------------------------------------------
 * StepIndicator Component
 * -------------------------------------------------------------------------- */

function StepIndicator({
  index,
  isCompleted,
  isActive,
  isUpcoming,
  icon,
  title,
  className,
  ...props
}: StepIndicatorProps) {
  return (
    <div
      data-slot="step-indicator"
      data-state={isCompleted ? "completed" : isActive ? "active" : "upcoming"}
      aria-hidden="true"
      className={cn(
        "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
        isCompleted && "border-primary bg-primary text-primary-foreground",
        isActive && "border-primary bg-primary text-primary-foreground ring-4 ring-primary/20",
        isUpcoming && "border-muted bg-background text-muted-foreground",
        className
      )}
      {...props}
    >
      {icon ? (
        <span className="[&>svg]:size-4">{icon}</span>
      ) : isCompleted ? (
        <Check className="size-5" strokeWidth={3} />
      ) : (
        <span>{index + 1}</span>
      )}
      {title && <span className="sr-only">{title}</span>}
    </div>
  )
}

export { StepIndicator }
