"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* -----------------------------------------------------------------------------
 * Stepper Context
 * -------------------------------------------------------------------------- */

export type StepperOrientation = "horizontal" | "vertical"

export interface StepperContextValue {
  currentStep: number
  orientation: StepperOrientation
  totalSteps: number
}

const StepperContext = React.createContext<StepperContextValue | undefined>(
  undefined
)

export function useStepperContext() {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error("useStepperContext must be used within a Stepper")
  }
  return context
}

/* -----------------------------------------------------------------------------
 * Stepper Props
 * -------------------------------------------------------------------------- */

export interface StepperProps extends React.ComponentProps<"div"> {
  /** The current active step (0-based index) */
  currentStep: number
  /** The orientation of the stepper */
  orientation?: StepperOrientation
}

/* -----------------------------------------------------------------------------
 * Stepper Component
 * -------------------------------------------------------------------------- */

function Stepper({
  currentStep,
  orientation = "horizontal",
  className,
  children,
  ...props
}: StepperProps) {
  // Count and clone children with index prop
  const childArray = React.Children.toArray(children)
  const totalSteps = childArray.length

  const contextValue = React.useMemo(
    () => ({
      currentStep,
      orientation,
      totalSteps,
    }),
    [currentStep, orientation, totalSteps]
  )

  // Clone children and inject index prop for auto-indexing
  const indexedChildren = childArray.map((child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { index } as React.Attributes)
    }
    return child
  })

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        data-slot="stepper"
        role="list"
        aria-label="Progress steps"
        data-orientation={orientation}
        className={cn(
          "flex w-full",
          orientation === "horizontal" && "flex-row items-start",
          orientation === "vertical" && "flex-col",
          className
        )}
        {...props}
      >
        {indexedChildren}
      </div>
    </StepperContext.Provider>
  )
}

export { Stepper }
