"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { CheckIcon, Loader2, LucideIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import {
  Collapsible,
  CollapsibleContent,
} from "@/registry/new-york/ui/collapsible"

// <---------- CONTEXT ---------->

interface StepperContextValue extends StepperProps {
  clickable?: boolean
  isError?: boolean
  isLoading?: boolean
  isVertical?: boolean
  stepCount?: number
  expandVerticalSteps?: boolean
  activeStep: number
  initialStep: number
}

const StepperContext = React.createContext<
  StepperContextValue & {
    nextStep: () => void
    prevStep: () => void
    resetSteps: () => void
    setStep: (step: number) => void
  }
>({
  steps: [],
  activeStep: 0,
  initialStep: 0,
  nextStep: () => {},
  prevStep: () => {},
  resetSteps: () => {},
  setStep: () => {},
})

type StepperContextProviderProps = {
  value: Omit<StepperContextValue, "activeStep">
  children: React.ReactNode
}

const StepperProvider = ({ value, children }: StepperContextProviderProps) => {
  const isError = value.state === "error"
  const isLoading = value.state === "loading"

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
        isError,
        isLoading,
        activeStep,
        nextStep,
        prevStep,
        resetSteps,
        setStep,
      }}
    >
      {children}
    </StepperContext.Provider>
  )
}

// <---------- HOOKS ---------->

function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T>()

  React.useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

function useStepper() {
  const context = React.useContext(StepperContext)

  if (context === undefined) {
    throw new Error("useStepper must be used within a StepperProvider")
  }

  const { children, className, ...rest } = context

  const isLastStep = context.activeStep === context.steps.length - 1
  const hasCompletedAllSteps = context.activeStep === context.steps.length

  const previousActiveStep = usePrevious(context.activeStep)

  const currentStep = context.steps[context.activeStep]
  const isOptionalStep = !!currentStep?.optional

  const isDisabledStep = context.activeStep === 0

  return {
    ...rest,
    isLastStep,
    hasCompletedAllSteps,
    isOptionalStep,
    isDisabledStep,
    currentStep,
    previousActiveStep,
  }
}

function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener("change", onChange)
    setValue(result.matches)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
}

// <---------- STEPS ---------->

type StepItem = {
  id?: string
  label?: string
  description?: string
  icon?: IconType
  optional?: boolean
}

interface StepOptions {
  orientation?: "vertical" | "horizontal"
  state?: "loading" | "error"
  responsive?: boolean
  checkIcon?: IconType
  errorIcon?: IconType
  onClickStep?: (step: number, setStep: (step: number) => void) => void
  mobileBreakpoint?: string
  variant?: "circle" | "circle-alt" | "line"
  expandVerticalSteps?: boolean
  size?: "sm" | "md" | "lg"
  styles?: {
    /** Styles for the main container */
    "main-container"?: string
    /** Styles for the horizontal step */
    "horizontal-step"?: string
    /** Styles for the horizontal step container (button and labels) */
    "horizontal-step-container"?: string
    /** Styles for the vertical step */
    "vertical-step"?: string
    /** Styles for the vertical step container (button and labels) */
    "vertical-step-container"?: string
    /** Styles for the vertical step content */
    "vertical-step-content"?: string
    /** Styles for the step button container */
    "step-button-container"?: string
    /** Styles for the label and description container */
    "step-label-container"?: string
    /** Styles for the step label */
    "step-label"?: string
    /** Styles for the step description */
    "step-description"?: string
  }
  variables?: {
    "--step-icon-size"?: string
    "--step-gap"?: string
  }
  scrollTracking?: boolean
}
interface StepperProps extends StepOptions {
  children?: React.ReactNode
  className?: string
  initialStep: number
  steps: StepItem[]
}

const VARIABLE_SIZES = {
  sm: "32px",
  md: "36px",
  lg: "40px",
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (props, ref: React.Ref<HTMLDivElement>) => {
    const {
      className,
      children,
      orientation: orientationProp,
      state,
      responsive,
      checkIcon,
      errorIcon,
      onClickStep,
      mobileBreakpoint,
      expandVerticalSteps = false,
      initialStep = 0,
      size,
      steps,
      variant,
      styles,
      variables,
      scrollTracking = false,
      ...rest
    } = props

    const childArr = React.Children.toArray(children)

    const items = [] as React.ReactElement[]

    const footer = childArr.map((child, _index) => {
      if (!React.isValidElement(child)) {
        throw new Error("Stepper children must be valid React elements.")
      }
      if (child.type === Step) {
        items.push(child)
        return null
      }

      return child
    })

    const stepCount = items.length

    const isMobile = useMediaQuery(
      `(max-width: ${mobileBreakpoint || "768px"})`
    )

    const clickable = !!onClickStep

    const orientation = isMobile && responsive ? "vertical" : orientationProp

    const isVertical = orientation === "vertical"

    return (
      <StepperProvider
        value={{
          initialStep,
          orientation,
          state,
          size,
          responsive,
          checkIcon,
          errorIcon,
          onClickStep,
          clickable,
          stepCount,
          isVertical,
          variant: variant || "circle",
          expandVerticalSteps,
          steps,
          scrollTracking,
          styles,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "stepper__main-container",
            "flex w-full flex-wrap",
            stepCount === 1 ? "justify-end" : "justify-between",
            orientation === "vertical" ? "flex-col" : "flex-row",
            variant === "line" && orientation === "horizontal" && "gap-4",
            className,
            styles?.["main-container"]
          )}
          style={
            {
              "--step-icon-size":
                variables?.["--step-icon-size"] ||
                `${VARIABLE_SIZES[size || "md"]}`,
              "--step-gap": variables?.["--step-gap"] || "8px",
            } as React.CSSProperties
          }
          {...rest}
        >
          <VerticalContent>{items}</VerticalContent>
        </div>
        {orientation === "horizontal" && (
          <HorizontalContent>{items}</HorizontalContent>
        )}
        {footer}
      </StepperProvider>
    )
  }
)

Stepper.defaultProps = {
  size: "md",
  orientation: "horizontal",
  responsive: true,
}

const VerticalContent = ({ children }: { children: React.ReactNode }) => {
  const { activeStep } = useStepper()

  const childArr = React.Children.toArray(children)
  const stepCount = childArr.length

  return (
    <>
      {React.Children.map(children, (child, i) => {
        const isCompletedStep =
          (React.isValidElement(child) &&
            (child.props as any).isCompletedStep) ??
          i < activeStep
        const isLastStep = i === stepCount - 1
        const isCurrentStep = i === activeStep

        const stepProps = {
          index: i,
          isCompletedStep,
          isCurrentStep,
          isLastStep,
        }

        if (React.isValidElement(child)) {
          return React.cloneElement(child, stepProps)
        }
        return null
      })}
    </>
  )
}

const HorizontalContent = ({ children }: { children: React.ReactNode }) => {
  const { activeStep } = useStepper()
  const childArr = React.Children.toArray(children)

  if (activeStep > childArr.length) {
    return null
  }

  return (
    <>
      {React.Children.map(childArr[activeStep], (node) => {
        if (!React.isValidElement(node)) {
          return null
        }
        return React.Children.map(node.props.children, (childNode) => childNode)
      })}
    </>
  )
}

// <---------- STEP ---------->

interface StepProps extends React.HTMLAttributes<HTMLLIElement> {
  label?: string | React.ReactNode
  description?: string
  icon?: IconType
  state?: "loading" | "error"
  checkIcon?: IconType
  errorIcon?: IconType
  isCompletedStep?: boolean
  isKeepError?: boolean
  onClickStep?: (step: number, setStep: (step: number) => void) => void
}

interface StepSharedProps extends StepProps {
  isLastStep?: boolean
  isCurrentStep?: boolean
  index?: number
  hasVisited: boolean | undefined
  isError?: boolean
  isLoading?: boolean
}

// Props which shouldn't be passed to to the Step component from the user
interface StepInternalConfig {
  index: number
  isCompletedStep?: boolean
  isCurrentStep?: boolean
  isLastStep?: boolean
}

interface FullStepProps extends StepProps, StepInternalConfig {}

const Step = React.forwardRef<HTMLLIElement, StepProps>(
  (props, ref: React.Ref<any>) => {
    const {
      children,
      description,
      icon,
      state,
      checkIcon,
      errorIcon,
      index,
      isCompletedStep,
      isCurrentStep,
      isLastStep,
      isKeepError,
      label,
      onClickStep,
    } = props as FullStepProps

    const { isVertical, isError, isLoading, clickable } = useStepper()

    const hasVisited = isCurrentStep || isCompletedStep

    const sharedProps = {
      isLastStep,
      isCompletedStep,
      isCurrentStep,
      index,
      isError,
      isLoading,
      clickable,
      label,
      description,
      hasVisited,
      icon,
      isKeepError,
      checkIcon,
      state,
      errorIcon,
      onClickStep,
    }

    const renderStep = () => {
      switch (isVertical) {
        case true:
          return (
            <VerticalStep ref={ref} {...sharedProps}>
              {children}
            </VerticalStep>
          )
        default:
          return <HorizontalStep ref={ref} {...sharedProps} />
      }
    }

    return renderStep()
  }
)

// <---------- VERTICAL STEP ---------->

type VerticalStepProps = StepSharedProps & {
  children?: React.ReactNode
}

const verticalStepVariants = cva(
  [
    "flex flex-col relative transition-all duration-200",
    "data-[completed=true]:[&:not(:last-child)]:after:bg-primary",
    "data-[invalid=true]:[&:not(:last-child)]:after:bg-destructive",
  ],
  {
    variants: {
      variant: {
        circle: cn(
          "[&:not(:last-child)]:pb-[var(--step-gap)] [&:not(:last-child)]:gap-[var(--step-gap)]",
          "[&:not(:last-child)]:after:content-[''] [&:not(:last-child)]:after:w-[2px] [&:not(:last-child)]:after:bg-border",
          "[&:not(:last-child)]:after:inset-x-[calc(var(--step-icon-size)/2)]",
          "[&:not(:last-child)]:after:absolute",
          "[&:not(:last-child)]:after:top-[calc(var(--step-icon-size)+var(--step-gap))]",
          "[&:not(:last-child)]:after:bottom-[var(--step-gap)]",
          "[&:not(:last-child)]:after:transition-all [&:not(:last-child)]:after:duration-200"
        ),
        line: "flex-1 border-t-0 mb-4",
      },
    },
  }
)

const VerticalStep = React.forwardRef<HTMLDivElement, VerticalStepProps>(
  (props, ref) => {
    const {
      children,
      index,
      isCompletedStep,
      isCurrentStep,
      label,
      description,
      icon,
      hasVisited,
      state,
      checkIcon: checkIconProp,
      errorIcon: errorIconProp,
      onClickStep,
    } = props

    const {
      checkIcon: checkIconContext,
      errorIcon: errorIconContext,
      isError,
      isLoading,
      variant,
      onClickStep: onClickStepGeneral,
      clickable,
      expandVerticalSteps,
      styles,
      scrollTracking,
      orientation,
      steps,
      setStep,
      isLastStep: isLastStepCurrentStep,
      previousActiveStep,
    } = useStepper()

    const opacity = hasVisited ? 1 : 0.8
    const localIsLoading = isLoading || state === "loading"
    const localIsError = isError || state === "error"

    const isLastStep = index === steps.length - 1

    const active =
      variant === "line" ? isCompletedStep || isCurrentStep : isCompletedStep
    const checkIcon = checkIconProp || checkIconContext
    const errorIcon = errorIconProp || errorIconContext

    const renderChildren = () => {
      if (!expandVerticalSteps) {
        return (
          <Collapsible open={isCurrentStep}>
            <CollapsibleContent
              ref={(node) => {
                if (
                  // If the step is the first step and the previous step
                  // was the last step or if the step is not the first step
                  // This prevents initial scrolling when the stepper
                  // is located anywhere other than the top of the view.
                  scrollTracking &&
                  ((index === 0 &&
                    previousActiveStep &&
                    previousActiveStep === steps.length) ||
                    (index && index > 0))
                ) {
                  node?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  })
                }
              }}
              className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up"
            >
              {children}
            </CollapsibleContent>
          </Collapsible>
        )
      }
      return children
    }

    return (
      <div
        ref={ref}
        className={cn(
          "stepper__vertical-step",
          verticalStepVariants({
            variant: variant?.includes("circle") ? "circle" : "line",
          }),
          isLastStepCurrentStep && "gap-[var(--step-gap)]",
          styles?.["vertical-step"]
        )}
        data-optional={steps[index || 0]?.optional}
        data-completed={isCompletedStep}
        data-active={active}
        data-clickable={clickable || !!onClickStep}
        data-invalid={localIsError}
        onClick={() =>
          onClickStep?.(index || 0, setStep) ||
          onClickStepGeneral?.(index || 0, setStep)
        }
      >
        <div
          data-vertical={true}
          data-active={active}
          className={cn(
            "stepper__vertical-step-container",
            "flex items-center",
            variant === "line" &&
              "border-s-[3px] data-[active=true]:border-primary py-2 ps-3",
            styles?.["vertical-step-container"]
          )}
        >
          <StepButtonContainer
            {...{ isLoading: localIsLoading, isError: localIsError, ...props }}
          >
            <StepIcon
              {...{
                index,
                isError: localIsError,
                isLoading: localIsLoading,
                isCurrentStep,
                isCompletedStep,
              }}
              icon={icon}
              checkIcon={checkIcon}
              errorIcon={errorIcon}
            />
          </StepButtonContainer>
          <StepLabel
            label={label}
            description={description}
            {...{ isCurrentStep, opacity }}
          />
        </div>
        <div
          className={cn(
            "stepper__vertical-step-content",
            !isLastStep && "min-h-4",
            variant !== "line" && "ps-[--step-icon-size]",
            variant === "line" && orientation === "vertical" && "min-h-0",
            styles?.["vertical-step-content"]
          )}
        >
          {renderChildren()}
        </div>
      </div>
    )
  }
)

// <---------- HORIZONTAL STEP ---------->

const HorizontalStep = React.forwardRef<HTMLDivElement, StepSharedProps>(
  (props, ref) => {
    const {
      isError,
      isLoading,
      onClickStep,
      variant,
      clickable,
      checkIcon: checkIconContext,
      errorIcon: errorIconContext,
      styles,
      steps,
      setStep,
    } = useStepper()

    const {
      index,
      isCompletedStep,
      isCurrentStep,
      hasVisited,
      icon,
      label,
      description,
      isKeepError,
      state,
      checkIcon: checkIconProp,
      errorIcon: errorIconProp,
    } = props

    const localIsLoading = isLoading || state === "loading"
    const localIsError = isError || state === "error"

    const opacity = hasVisited ? 1 : 0.8

    const active =
      variant === "line" ? isCompletedStep || isCurrentStep : isCompletedStep

    const checkIcon = checkIconProp || checkIconContext
    const errorIcon = errorIconProp || errorIconContext

    return (
      <div
        aria-disabled={!hasVisited}
        className={cn(
          "stepper__horizontal-step",
          "flex items-center relative transition-all duration-200",
          "[&:not(:last-child)]:flex-1",
          "[&:not(:last-child)]:after:transition-all [&:not(:last-child)]:after:duration-200",
          "[&:not(:last-child)]:after:content-[''] [&:not(:last-child)]:after:h-[2px] [&:not(:last-child)]:after:bg-border",
          "data-[completed=true]:[&:not(:last-child)]:after:bg-primary",
          "data-[invalid=true]:[&:not(:last-child)]:after:bg-destructive",
          variant === "circle-alt" &&
            "justify-start flex-col flex-1 [&:not(:last-child)]:after:relative [&:not(:last-child)]:after:order-[-1] [&:not(:last-child)]:after:start-[50%] [&:not(:last-child)]:after:end-[50%] [&:not(:last-child)]:after:top-[calc(var(--step-icon-size)/2)] [&:not(:last-child)]:after:w-[calc((100%-var(--step-icon-size))-(var(--step-gap)))]",
          variant === "circle" &&
            "[&:not(:last-child)]:after:flex-1 [&:not(:last-child)]:after:ms-[var(--step-gap)] [&:not(:last-child)]:after:me-[var(--step-gap)]",
          variant === "line" &&
            "flex-col flex-1 border-t-[3px] data-[active=true]:border-primary",
          styles?.["horizontal-step"]
        )}
        data-optional={steps[index || 0]?.optional}
        data-completed={isCompletedStep}
        data-active={active}
        data-invalid={localIsError}
        data-clickable={clickable}
        onClick={() => onClickStep?.(index || 0, setStep)}
        ref={ref}
      >
        <div
          className={cn(
            "stepper__horizontal-step-container",
            "flex items-center",
            variant === "circle-alt" && "flex-col justify-center gap-1",
            variant === "line" && "w-full",
            styles?.["horizontal-step-container"]
          )}
        >
          <StepButtonContainer
            {...{ ...props, isError: localIsError, isLoading: localIsLoading }}
          >
            <StepIcon
              {...{
                index,
                isCompletedStep,
                isCurrentStep,
                isError: localIsError,
                isKeepError,
                isLoading: localIsLoading,
              }}
              icon={icon}
              checkIcon={checkIcon}
              errorIcon={errorIcon}
            />
          </StepButtonContainer>
          <StepLabel
            label={label}
            description={description}
            {...{ isCurrentStep, opacity }}
          />
        </div>
      </div>
    )
  }
)

// <---------- STEP BUTTON CONTAINER ---------->

type StepButtonContainerProps = StepSharedProps & {
  children?: React.ReactNode
}

const StepButtonContainer = ({
  isCurrentStep,
  isCompletedStep,
  children,
  isError,
  isLoading: isLoadingProp,
  onClickStep,
}: StepButtonContainerProps) => {
  const {
    clickable,
    isLoading: isLoadingContext,
    variant,
    styles,
  } = useStepper()

  const currentStepClickable = clickable || !!onClickStep

  const isLoading = isLoadingProp || isLoadingContext

  if (variant === "line") {
    return null
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        "stepper__step-button-container",
        "rounded-full p-0 pointer-events-none",
        "w-[var(--step-icon-size)] h-[var(--step-icon-size)]",
        "border-2 flex rounded-full justify-center items-center",
        "data-[clickable=true]:pointer-events-auto",
        "data-[active=true]:bg-primary data-[active=true]:border-primary data-[active=true]:text-primary-foreground",
        "data-[current=true]:border-primary data-[current=true]:bg-secondary",
        "data-[invalid=true]:bg-destructive data-[invalid=true]:border-destructive data-[invalid=true]:text-destructive-foreground",
        styles?.["step-button-container"]
      )}
      aria-current={isCurrentStep ? "step" : undefined}
      data-current={isCurrentStep}
      data-invalid={isError && (isCurrentStep || isCompletedStep)}
      data-active={isCompletedStep}
      data-clickable={currentStepClickable}
      data-loading={isLoading && (isCurrentStep || isCompletedStep)}
    >
      {children}
    </Button>
  )
}

// <---------- STEP ICON ---------->

type IconType = LucideIcon | React.ComponentType<any> | undefined

const iconVariants = cva("", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-4",
      lg: "size-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

interface StepIconProps {
  isCompletedStep?: boolean
  isCurrentStep?: boolean
  isError?: boolean
  isLoading?: boolean
  isKeepError?: boolean
  icon?: IconType
  index?: number
  checkIcon?: IconType
  errorIcon?: IconType
}

const StepIcon = React.forwardRef<HTMLDivElement, StepIconProps>(
  (props, ref) => {
    const { size } = useStepper()

    const {
      isCompletedStep,
      isCurrentStep,
      isError,
      isLoading,
      isKeepError,
      icon: CustomIcon,
      index,
      checkIcon: CustomCheckIcon,
      errorIcon: CustomErrorIcon,
    } = props

    const Icon = React.useMemo(
      () => (CustomIcon ? CustomIcon : null),
      [CustomIcon]
    )

    const ErrorIcon = React.useMemo(
      () => (CustomErrorIcon ? CustomErrorIcon : null),
      [CustomErrorIcon]
    )

    const Check = React.useMemo(
      () => (CustomCheckIcon ? CustomCheckIcon : CheckIcon),
      [CustomCheckIcon]
    )

    return React.useMemo(() => {
      if (isCompletedStep) {
        if (isError && isKeepError) {
          return (
            <div key="icon">
              <X className={cn(iconVariants({ size }))} />
            </div>
          )
        }
        return (
          <div key="check-icon">
            <Check className={cn(iconVariants({ size }))} />
          </div>
        )
      }
      if (isCurrentStep) {
        if (isError && ErrorIcon) {
          return (
            <div key="error-icon">
              <ErrorIcon className={cn(iconVariants({ size }))} />
            </div>
          )
        }
        if (isError) {
          return (
            <div key="icon">
              <X className={cn(iconVariants({ size }))} />
            </div>
          )
        }
        if (isLoading) {
          return (
            <Loader2 className={cn(iconVariants({ size }), "animate-spin")} />
          )
        }
      }
      if (Icon) {
        return (
          <div key="step-icon">
            <Icon className={cn(iconVariants({ size }))} />
          </div>
        )
      }
      return (
        <span
          ref={ref}
          key="label"
          className={cn("font-medium text-center text-md")}
        >
          {(index || 0) + 1}
        </span>
      )
    }, [
      isCompletedStep,
      isCurrentStep,
      isError,
      isLoading,
      Icon,
      index,
      Check,
      ErrorIcon,
      isKeepError,
      ref,
      size,
    ])
  }
)

// <---------- STEP LABEL ---------->

interface StepLabelProps {
  isCurrentStep?: boolean
  opacity: number
  label?: string | React.ReactNode
  description?: string | null
}

const labelVariants = cva("", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const descriptionVariants = cva("", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-xs",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const StepLabel = ({
  isCurrentStep,
  opacity,
  label,
  description,
}: StepLabelProps) => {
  const { variant, styles, size, orientation } = useStepper()
  const shouldRender = !!label || !!description

  return shouldRender ? (
    <div
      aria-current={isCurrentStep ? "step" : undefined}
      className={cn(
        "stepper__step-label-container",
        "flex-col flex",
        variant !== "line" ? "ms-2" : orientation === "horizontal" && "my-2",
        variant === "circle-alt" && "text-center",
        variant === "circle-alt" && orientation === "horizontal" && "ms-0",
        variant === "circle-alt" && orientation === "vertical" && "text-start",
        styles?.["step-label-container"]
      )}
      style={{
        opacity,
      }}
    >
      {!!label && (
        <span
          className={cn(
            "stepper__step-label",
            labelVariants({ size }),
            styles?.["step-label"]
          )}
        >
          {label}
        </span>
      )}
      {!!description && (
        <span
          className={cn(
            "stepper__step-description",
            "text-muted-foreground",
            descriptionVariants({ size }),
            styles?.["step-description"]
          )}
        >
          {description}
        </span>
      )}
    </div>
  ) : null
}

export { Stepper, Step, useStepper }
export type { StepProps, StepperProps, StepItem }
