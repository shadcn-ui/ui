import React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

import { Button } from "./button"
import { Separator } from "./separator"

type UseStepper = {
  nextStep: () => void
  prevStep: () => void
  resetSteps: () => void
  setStep: (step: number) => void
  activeStep: number
  isDisabledStep: boolean
  isLastStep: boolean
  isOptionalStep: boolean | undefined
}

export function useStepper(): UseStepper {
  const { steps, initialStep } = useStepperContext()

  if (steps.length === 0) {
    throw new Error(
      "useStepper must be used within a StepperProvider. Wrap a parent component in <StepperProvider> to fix this error."
    )
  }

  const [activeStep, setActiveStep] = React.useState(initialStep)

  const nextStep = () => {
    setActiveStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setActiveStep((prev) => prev - 1)
  }

  const resetSteps = () => {
    setActiveStep(initialStep)
  }

  const setStep = (step: number) => {
    setActiveStep(step)
  }

  const isDisabledStep = activeStep === 0

  const isLastStep = activeStep === steps.length - 1

  const isOptionalStep = steps[activeStep]?.optional

  return {
    nextStep,
    prevStep,
    resetSteps,
    setStep,
    activeStep,
    isDisabledStep,
    isLastStep,
    isOptionalStep,
  }
}

interface StepperProps {
  initialStep: number
  steps: {
    label: string | React.ReactNode
    description?: string | React.ReactNode
    optional?: boolean
  }[]
  orientation?: "vertical" | "horizontal"
  labelOrientation?: "vertical" | "horizontal"
  responsive?: boolean
  variant?: "default" | "ghost" | "outline" | "secondary"
  status?: "default" | "success" | "error" | "warning" | "loading"
  clickable?: boolean
}

const StepperContext = React.createContext<StepperProps>({
  initialStep: 0,
  steps: [],
})

export const useStepperContext = () => React.useContext(StepperContext)

const StepperProvider = ({
  value,
  children,
}: {
  value: StepperProps
  children: React.ReactNode
}) => {
  return (
    <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
  )
}

export const Stepper = React.forwardRef<
  HTMLDivElement,
  StepperProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      initialStep,
      steps,
      status = "default",
      orientation: orientationProp = "horizontal",
      responsive = true,
      labelOrientation = "horizontal",
      children,
      variant = "default",
      clickable = true,
      className,
      ...props
    },
    ref
  ) => {
    const isMobile = useMediaQuery("(max-width: 43em)")
    const orientation = isMobile && responsive ? "vertical" : orientationProp

    const childrens = React.Children.toArray(children).map((child, index) => {
      if (!React.isValidElement(child)) {
        return null
      }
      if (child.type !== StepperItem) {
        return child
      }
      const stepperItemProps = {
        ...child.props,
        step: index,
      }
      return React.cloneElement(child, stepperItemProps)
    })

    return (
      <StepperProvider
        value={{
          steps,
          initialStep,
          orientation,
          responsive,
          labelOrientation,
          variant,
        }}
      >
        <div
          {...props}
          ref={ref}
          className={cn(
            "flex w-full flex-1 justify-between gap-4 text-center",
            orientation === "vertical" ? "flex-col" : "flex-row",
            className
          )}
        >
          {childrens}
        </div>
      </StepperProvider>
    )
  }
)

const stepperItemVariants = cva("relative flex flex-row gap-2", {
  variants: {
    isLastStep: {
      true: "flex-[0_0_auto] justify-end",
      false: "flex-[1_0_auto] justify-start",
    },
    isVertical: {
      true: "flex-col",
      false: "items-center",
    },
    isClickable: {
      true: "cursor-pointer",
    },
  },
  compoundVariants: [
    {
      isVertical: true,
      isLastStep: true,
      class: "w-full flex-[1_0_auto] flex-col items-start justify-start",
    },
  ],
})

export const StepperItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode
  }
  // @ts-ignore
>(({ step, children, className, onClick, ...props }, ref) => {
  const { steps, orientation, labelOrientation, variant, status, clickable } =
    useStepperContext()

  const { activeStep, setStep } = useStepper()

  const isLastStep = steps.length - 1 === step

  const isActive = step === activeStep
  const isCompleted = step < activeStep
  const isDisabled = step > activeStep && !clickable
  const isVisited = isActive || isCompleted

  const isVertical = orientation === "vertical"
  const isVerticalLabel = labelOrientation === "vertical"

  const isError = isActive && status === "error"

  const onClickItem = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDisabled) {
      return
    }
    setStep(step)
    onClick?.(e)
  }

  return (
    <div
      className={cn(
        stepperItemVariants({
          isLastStep,
          isVertical,
          isClickable: clickable,
        }),
        className
      )}
      ref={ref}
      onClick={onClickItem}
      aria-disabled={!isVisited}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          isVerticalLabel && !isVertical && "flex-col"
        )}
      >
        <Button
          aria-current={isActive ? "step" : undefined}
          data-invalid={isError}
          data-highlighted={isCompleted}
          disabled={!isVisited}
          className={cn(
            "aspect-square h-12 w-12 rounded-full data-[highlighted=true]:bg-green-700 data-[highlighted=true]:text-white",
            isActive ? "px-3 py-2" : ""
          )}
          variant={isError ? "destructive" : variant}
        >
          {isCompleted ? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            step + 1
          )}
        </Button>
        <div
          className={cn(
            "text-start",
            isVerticalLabel && !isVertical && "text-center"
          )}
        >
          <p className="text-sm text-slate-900 dark:text-slate-100">
            {steps[step].label}
          </p>
          {steps[step].description && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {steps[step].description}
            </p>
          )}
        </div>
      </div>
      {!isLastStep && (
        <Separator
          className={cn(
            "data-[highlighted=true]:bg-green-700",
            isVertical
              ? "ms-6 mt-1 flex h-auto min-h-[2rem] w-[1px] border-l-2"
              : "h-[2px] flex-1"
          )}
          orientation={isVertical ? "vertical" : "horizontal"}
        />
      )}
    </div>
  )
})

StepperItem.displayName = "StepperItem"
