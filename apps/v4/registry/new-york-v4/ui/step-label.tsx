"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* -----------------------------------------------------------------------------
 * StepLabel Props
 * -------------------------------------------------------------------------- */

export interface StepLabelProps extends React.ComponentProps<"div"> {
  /** The step title */
  title?: string
  /** Optional description */
  description?: string
  /** Whether this step is active */
  isActive: boolean
  /** Whether this step is completed */
  isCompleted: boolean
  /** The orientation of the stepper */
  orientation?: "horizontal" | "vertical"
}

/* -----------------------------------------------------------------------------
 * StepLabel Component
 * -------------------------------------------------------------------------- */

function StepLabel({
  title,
  description,
  isActive,
  isCompleted,
  orientation = "horizontal",
  className,
  ...props
}: StepLabelProps) {
  return (
    <div
      data-slot="step-label"
      className={cn(
        "flex flex-col gap-0.5",
        orientation === "horizontal" && "items-center text-center",
        orientation === "vertical" && "items-start pt-1",
        className
      )}
      {...props}
    >
      {title && (
        <span
          data-slot="step-title"
          className={cn(
            "text-sm font-medium leading-none",
            isActive && "text-foreground",
            isCompleted && "text-foreground",
            !isActive && !isCompleted && "text-muted-foreground"
          )}
        >
          {title}
        </span>
      )}
      {description && (
        <span
          data-slot="step-description"
          className="mt-1 text-xs text-muted-foreground"
        >
          {description}
        </span>
      )}
    </div>
  )
}

export { StepLabel }
