import React, { useEffect, useRef } from "react"
import { cva } from "class-variance-authority"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

import { Button } from "./button"
import { Separator } from "./separator"

interface StepperProps {
  steps: {
    label: string | React.ReactNode
    description?: string | React.ReactNode
    optional?: boolean
  }[]
  initialStep: number
  orientation?: "vertical" | "horizontal"
  responsive?: boolean
  labelOrientation?: "vertical" | "horizontal"
  variant?: "default" | "ghost" | "outline" | "secondary"
  status?: "default" | "success" | "error" | "warning" | "loading"
  clickable?: boolean
}

interface ContextStepperProps extends StepperProps {
  nextStep: () => void
  prevStep: () => void
  resetSteps: () => void
  setStep: (step: number) => void
  activeStep: number
}

const StepperContext = React.createContext<ContextStepperProps>({
  steps: [],
  initialStep: 0,
  nextStep: () => {},
  prevStep: () => {},
  resetSteps: () => {},
  setStep: () => {},
  activeStep: 0,
})

const StepperProvider = ({
  value,
  children,
}: {
  value: StepperProps
  children: React.ReactNode
}) => {
  const [activeStep, setActiveStep] = React.useState(value.initialStep)
  const nextStep = () => {
    setActiveStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setActiveStep((prev) => prev - 1)
  }

  const resetSteps = () => {
    setActiveStep(value.initialStep)
  }

  const setStep = (step: number) => {
    setActiveStep(step)
  }

  return (
    <StepperContext.Provider
      value={{
        ...value,
        nextStep,
        prevStep,
        resetSteps,
        setStep,
        activeStep,
      }}
    >
      {children}
    </StepperContext.Provider>
  )
}

export function useStepper() {
  const context = React.useContext(StepperContext)

  if (context === undefined) {
    throw new Error("useStepper must be used within a StepperProvider")
  }

  const isDisabledStep = context.activeStep === 0
  const isLastStep = context.activeStep === context.steps.length - 1
  const isOptionalStep = context.steps[context.activeStep]?.optional
  const isFinished = context.activeStep === context.steps.length

  return {
    ...context,
    isDisabledStep,
    isLastStep,
    isOptionalStep,
    isFinished,
  }
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

    const footer = [] as React.ReactElement[]

    const items = React.Children.toArray(children).map((child, index) => {
      if (!React.isValidElement(child)) {
        throw new Error("Stepper children must be valid React elements.")
      }
      if (child.type !== StepperItem && child.type !== StepperFooter) {
        throw new Error(
          "Stepper children must be either <StepperItem> or <StepperFooter>."
        )
      }
      if (child.type === StepperFooter) {
        footer.push(child)
        return null
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
          clickable,
          status,
        }}
      >
        <div ref={ref} className={cn("space-y-4", className)} {...props}>
          <div
            className={cn(
              "flex w-full flex-1 justify-between gap-4 text-center",
              orientation === "vertical" ? "flex-col" : "flex-row"
            )}
          >
            {items}
          </div>
          {orientation === "horizontal" && (
            <HorizontalContent>{children}</HorizontalContent>
          )}
          {footer}
        </div>
      </StepperProvider>
    )
  }
)

const HorizontalContent = ({ children }: { children?: React.ReactNode }) => {
  const { activeStep, isFinished } = useStepper()

  if (isFinished) {
    return null
  }

  const activeStepperItem = React.Children.toArray(children)[
    activeStep
  ] as React.ReactElement

  const content = activeStepperItem?.props?.children

  return content
}

const stepperItemVariants = cva("relative flex flex-row gap-4", {
  variants: {
    isLastStep: {
      true: "flex-[0_0_auto] justify-end",
      false: "flex-[1_0_auto] justify-start",
    },
    isVertical: {
      true: "flex-col",
      false: "items-center",
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
  Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> & {
    icon?: React.ReactNode
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  }
  // @ts-ignore - step is a prop that is added from the Stepper through React.Children.
>(({ step, children, className, onClick, icon, ...props }, ref) => {
  const {
    activeStep,
    setStep,
    steps,
    orientation,
    labelOrientation,
    variant,
    status,
    clickable,
  } = useStepper()

  const isActive = step === activeStep
  const isCompleted = step < activeStep
  const isDisabled = step > activeStep && !clickable

  const isLastStep = step === steps.length - 1

  const isVertical = orientation === "vertical"
  const isVerticalLabel = labelOrientation === "vertical"

  const isError = isActive && status === "error"

  const buttonRef = useRef<HTMLButtonElement>(null)

  const content = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type !== StepperFooter
  )

  const footer = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === StepperFooter
  )[0] as React.ReactElement

  const onClickItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isDisabled) {
      return
    }
    setStep(step)
    onClick?.(e)
  }

  useEffect(() => {
    if (!isActive) {
      return
    }
    buttonRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }, [isActive])

  const iconComponent = icon || step + 1

  return (
    <div
      className={cn(
        stepperItemVariants({
          isLastStep,
          isVertical,
        }),
        className
      )}
      ref={ref}
      {...props}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          isVerticalLabel && !isVertical && "flex-col gap-2"
        )}
      >
        <Button
          data-highlighted={isCompleted}
          disabled={isDisabled}
          onClick={onClickItem}
          ref={buttonRef}
          className={cn(
            "aspect-square h-12 w-12 rounded-full data-[highlighted=true]:bg-green-700 data-[highlighted=true]:text-white",
            clickable && "cursor-pointer",
            !isActive && !isDisabled && !isCompleted && "opacity-50"
          )}
          variant={isError ? "destructive" : variant}
        >
          {isCompleted ? <Check className="h-6 w-6" /> : iconComponent}
        </Button>
        <div
          className={cn(
            "w-max text-start",
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
      <div className="flex w-full gap-8">
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
        {isVertical && isActive && (
          <div className="w-full space-y-4">
            {content}
            {footer}
          </div>
        )}
      </div>
    </div>
  )
})

StepperItem.displayName = "StepperItem"

export const StepperFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
})

StepperFooter.displayName = "StepperFooter"
