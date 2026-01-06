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
        "flex",
        orientation === "horizontal"
          ? "flex-row items-start gap-2"
          : "flex-col items-stretch gap-0",
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

interface StepContextValue {
  color?: string
  computedStatus: StepStatus
}

const StepContext = React.createContext<StepContextValue | undefined>(undefined)

function useStep() {
  return React.useContext(StepContext)
}

interface StepProps extends React.ComponentProps<"div"> {
  step: number
  status?: StepStatus
  disabled?: boolean
  clickable?: boolean
  color?: string
}

function Step({
  className,
  step,
  status,
  disabled = false,
  clickable = true,
  color,
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

  // Extract custom StepIndicator from children if present
  let customIndicator: React.ReactNode = null
  const otherChildren: React.ReactNode[] = []

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === StepIndicator) {
      customIndicator = child
    } else {
      otherChildren.push(child)
    }
  })

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
    <StepContext.Provider value={{ color, computedStatus }}>
      <div
        data-slot="step"
        data-status={computedStatus}
        data-step={step}
        data-orientation={orientation}
        className={cn(
          "group relative flex",
          orientation === "horizontal"
            ? "flex-1 flex-col items-center gap-2"
            : "min-h-16 flex-row items-start gap-4 pb-2",
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
          {customIndicator || (
            <StepIndicator status={computedStatus} step={step} />
          )}
          {!isLast && orientation === "horizontal" && (
            <StepConnector status={computedStatus} />
          )}
        </div>
        {!isLast && orientation === "vertical" && (
          <StepConnector status={computedStatus} />
        )}
        <div
          className={cn(
            "flex flex-col",
            orientation === "horizontal" ? "items-center text-center" : "pt-0.5"
          )}
        >
          {otherChildren}
        </div>
      </div>
    </StepContext.Provider>
  )
}

interface StepIndicatorProps extends React.ComponentProps<"div"> {
  status?: StepStatus
  step?: number
}

function StepIndicator({
  className,
  status: statusProp,
  step = 0,
  children,
  style,
  ...props
}: StepIndicatorProps) {
  const stepContext = useStep()
  const status = statusProp ?? stepContext?.computedStatus ?? "pending"
  const color = stepContext?.color

  const shouldApplyColor =
    color && (status === "active" || status === "completed")

  const customStyle = shouldApplyColor
    ? {
        backgroundColor: color,
        borderColor: color,
        ...style,
      }
    : style

  return (
    <div
      data-slot="step-indicator"
      data-status={status}
      className={cn(
        "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
        status === "pending" &&
          "border-muted-foreground/30 bg-background text-muted-foreground",
        status === "active" &&
          !color &&
          "border-primary bg-primary text-primary-foreground",
        status === "completed" &&
          !color &&
          "border-primary bg-primary text-primary-foreground",
        (status === "active" || status === "completed") &&
          color &&
          "text-white",
        status === "error" &&
          "border-destructive bg-destructive/10 text-destructive",
        className
      )}
      style={customStyle}
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

function StepConnector({
  className,
  status,
  style,
  ...props
}: StepConnectorProps) {
  const { orientation } = useStepper()
  const stepContext = useStep()
  const color = stepContext?.color

  const shouldApplyColor = color && status === "completed"

  const customStyle = shouldApplyColor
    ? { backgroundColor: color, ...style }
    : style

  return (
    <div
      data-slot="step-connector"
      data-status={status}
      className={cn(
        "transition-colors",
        orientation === "horizontal"
          ? "absolute top-4 right-[calc(-50%+20px)] left-[calc(50%+20px)] h-0.5 -translate-y-1/2"
          : "absolute top-10 left-4 h-[calc(100%-24px)] w-0.5 -translate-x-1/2",
        status === "completed" && !color && "bg-primary",
        status !== "completed" && "bg-muted-foreground/30",
        className
      )}
      style={customStyle}
      {...props}
    />
  )
}

type StepTitleProps = React.ComponentProps<"h3">

function StepTitle({ className, ...props }: StepTitleProps) {
  return (
    <h3
      data-slot="step-title"
      className={cn(
        "group-data-[status=active]:text-foreground group-data-[status=completed]:text-foreground group-data-[status=pending]:text-muted-foreground group-data-[status=error]:text-destructive text-sm leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

type StepDescriptionProps = React.ComponentProps<"p">

function StepDescription({ className, ...props }: StepDescriptionProps) {
  return (
    <p
      data-slot="step-description"
      className={cn("text-muted-foreground mt-1 text-xs", className)}
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
