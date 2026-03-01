"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { type StepperOrientation } from "./stepper"

/* -----------------------------------------------------------------------------
 * StepConnector Props
 * -------------------------------------------------------------------------- */

export interface StepConnectorProps extends React.ComponentProps<"div"> {
  /** Whether the preceding step is completed */
  isCompleted: boolean
  /** The orientation of the stepper */
  orientation: StepperOrientation
}

/* -----------------------------------------------------------------------------
 * StepConnector Component
 * -------------------------------------------------------------------------- */

function StepConnector({
  isCompleted,
  orientation,
  className,
  ...props
}: StepConnectorProps) {
  return (
    <div
      data-slot="step-connector"
      data-state={isCompleted ? "completed" : "pending"}
      data-orientation={orientation}
      aria-hidden="true"
      role="presentation"
      className={cn(
        "transition-colors",
        orientation === "horizontal" && "h-0.5 flex-1",
        orientation === "vertical" && "my-2 h-10 w-0.5",
        isCompleted ? "bg-primary" : "bg-border",
        className
      )}
      {...props}
    />
  )
}

export { StepConnector }
