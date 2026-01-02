"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type StepStatus = "pending" | "active" | "completed" | "error"

interface StepperContextValue {
  currentStep: number
  orientation: "horizontal" | "vertical"
  onStepChange?: (step: number) => void
  totalSteps: number
}

const StepperContext = React.createContext<StepperContextValue | undefined>(
  undefined
)

function useStepper() {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error("Stepper components must be used within <Stepper>")
  }
  return context
}

interface StepperProps extends React.ComponentProps<"div"> {
  currentStep?: number
  orientation?: "horizontal" | "vertical"
  onStepChange?: (step: number) => void
}

function Stepper({
  className,
  currentStep = 0,
  orientation = "horizontal",
  onStepChange,
  children,
  ...props
}: StepperProps) {
  const totalSteps = React.Children.count(children)

  return (
    <div
      data-slot="stepper"
      data-orientation={orientation}
      className={cn(
        "flex gap-2",
        orientation === "horizontal"
          ? "flex-row items-start"
          : "flex-col items-stretch",
        className
      )}
      {...props}
    >
      <StepperContext.Provider
        value={{
          currentStep,
          orientation,
          onStepChange,
          totalSteps,
        }}
      >
        {children}
      </StepperContext.Provider>
    </div>
  )
}

interface StepProps extends React.ComponentProps<"div"> {
  step: number
  status?: StepStatus
  disabled?: boolean
  clickable?: boolean
}

function Step({
  className,
  step,
  status,
  disabled = false,
  clickable = true,
  children,
  ...props
}: StepProps) {
  const { currentStep, orientation, onStepChange, totalSteps } = useStepper()

  const computedStatus: StepStatus =
    status ||
    (step < currentStep
      ? "completed"
      : step === currentStep
        ? "active"
        : "pending")

  const isLast = step === totalSteps - 1

  const handleClick = () => {
    if (clickable && !disabled && onStepChange) {
      onStepChange(step)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      data-slot="step"
      data-status={computedStatus}
      data-step={step}
      data-orientation={orientation}
      className={cn(
        "group flex relative",
        orientation === "horizontal"
          ? "flex-1 flex-col items-center gap-2"
          : "flex-row items-start gap-4",
        clickable && !disabled && "cursor-pointer",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={clickable && !disabled ? "button" : undefined}
      tabIndex={clickable && !disabled ? 0 : undefined}
      aria-current={computedStatus === "active" ? "step" : undefined}
      {...props}
    >
      <div
        className={cn(
          "relative flex items-center justify-center",
          orientation === "horizontal" ? "w-full" : "flex-col"
        )}
      >
        <StepIndicator status={computedStatus} step={step} />
        {!isLast && <StepConnector status={computedStatus} />}
      </div>
      <div
        className={cn(
          "flex flex-col",
          orientation === "horizontal" ? "items-center text-center" : "pt-0.5"
        )}
      >
        {children}
      </div>
    </div>
  )
}

interface StepIndicatorProps extends React.ComponentProps<"div"> {
  status: StepStatus
  step: number
}

function StepIndicator({
  className,
  status,
  step,
  children,
  ...props
}: StepIndicatorProps) {
  return (
    <div
      data-slot="step-indicator"
      data-status={status}
      className={cn(
        "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
        status === "pending" &&
          "border-muted-foreground/30 bg-background text-muted-foreground",
        status === "active" &&
          "border-primary bg-primary text-primary-foreground",
        status === "completed" &&
          "border-primary bg-primary text-primary-foreground",
        status === "error" &&
          "border-destructive bg-destructive/10 text-destructive",
        className
      )}
      {...props}
    >
      {children ||
        (status === "completed" ? (
          <CheckIcon className="size-4" />
        ) : (
          <span>{step + 1}</span>
        ))}
    </div>
  )
}

interface StepConnectorProps extends React.ComponentProps<"div"> {
  status: StepStatus
}

function StepConnector({ className, status, ...props }: StepConnectorProps) {
  const { orientation } = useStepper()

  return (
    <div
      data-slot="step-connector"
      data-status={status}
      className={cn(
        "transition-colors",
        orientation === "horizontal"
          ? "absolute left-[calc(50%+20px)] right-[calc(-50%+20px)] top-4 h-0.5 -translate-y-1/2"
          : "absolute left-4 top-10 h-[calc(100%-24px)] w-0.5 -translate-x-1/2",
        status === "completed" ? "bg-primary" : "bg-muted-foreground/30",
        className
      )}
      {...props}
    />
  )
}

interface StepTitleProps extends React.ComponentProps<"h3"> {}

function StepTitle({ className, ...props }: StepTitleProps) {
  return (
    <h3
      data-slot="step-title"
      className={cn(
        "text-sm font-medium leading-none group-data-[status=active]:text-foreground group-data-[status=completed]:text-foreground group-data-[status=pending]:text-muted-foreground group-data-[status=error]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

interface StepDescriptionProps extends React.ComponentProps<"p"> {}

function StepDescription({ className, ...props }: StepDescriptionProps) {
  return (
    <p
      data-slot="step-description"
      className={cn("mt-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Stepper,
  Step,
  StepIndicator,
  StepConnector,
  StepTitle,
  StepDescription,
  useStepper,
  type StepStatus,
  type StepperProps,
  type StepProps,
}
