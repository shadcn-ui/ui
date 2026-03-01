"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { StepConnector } from "./step-connector"
import { StepIndicator } from "./step-indicator"
import { StepLabel } from "./step-label"
import { useStepperContext } from "./stepper"

/* -----------------------------------------------------------------------------
 * StepperItem Props
 * -------------------------------------------------------------------------- */

export interface StepperItemProps extends React.ComponentProps<"div"> {
  /** The step index (0-based). If not provided, it will be auto-assigned. */
  index?: number
  /** Optional title for the step */
  title?: string
  /** Optional description for the step */
  description?: string
  /** Optional custom icon to display in the indicator */
  icon?: React.ReactNode
}

/* -----------------------------------------------------------------------------
 * StepperItem Component
 * -------------------------------------------------------------------------- */

function StepperItem({
  index: indexProp,
  title,
  description,
  icon,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { currentStep, orientation, totalSteps } = useStepperContext()

  // Use provided index or fall back to 0
  const index = indexProp ?? 0

  // Derive step state from index comparison
  const isCompleted = index < currentStep
  const isActive = index === currentStep
  const isUpcoming = index > currentStep
  const isLastStep = index === totalSteps - 1

  return (
    <div
      data-slot="stepper-item"
      role="listitem"
      aria-current={isActive ? "step" : undefined}
      data-state={isCompleted ? "completed" : isActive ? "active" : "upcoming"}
      data-orientation={orientation}
      className={cn(
        "group flex",
        orientation === "horizontal" && "flex-1 items-start",
        orientation === "horizontal" && isLastStep && "flex-none",
        orientation === "vertical" && "gap-4",
        className
      )}
      {...props}
    >
      {orientation === "horizontal" ? (
        // Horizontal layout: indicator on top, label below, connector to the right
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full items-center">
            <StepIndicator
              index={index}
              isCompleted={isCompleted}
              isActive={isActive}
              isUpcoming={isUpcoming}
              icon={icon}
              title={title}
            />
            {!isLastStep && (
              <StepConnector isCompleted={isCompleted} orientation={orientation} />
            )}
          </div>
          {(title || description) && (
            <StepLabel
              title={title}
              description={description}
              isActive={isActive}
              isCompleted={isCompleted}
              orientation={orientation}
            />
          )}
        </div>
      ) : (
        // Vertical layout: indicator on left with connector below, label on right
        <>
          <div className="flex flex-col items-center">
            <StepIndicator
              index={index}
              isCompleted={isCompleted}
              isActive={isActive}
              isUpcoming={isUpcoming}
              icon={icon}
              title={title}
            />
            {!isLastStep && (
              <StepConnector isCompleted={isCompleted} orientation={orientation} />
            )}
          </div>
          {(title || description) && (
            <StepLabel
              title={title}
              description={description}
              isActive={isActive}
              isCompleted={isCompleted}
              orientation={orientation}
            />
          )}
        </>
      )}

      {children}
    </div>
  )
}

export { StepperItem }
