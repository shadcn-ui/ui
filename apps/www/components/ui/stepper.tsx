import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import { Check, Loader2, X } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "./button"
import { Separator } from "./separator"
import { useMediaQuery } from "./use-stepper"

/********** StepperProvider **********/

interface StepperContextValue extends StepperProps {
  isClickable?: boolean
  isError?: boolean
  isLoading?: boolean
  isVertical?: boolean
  isLabelVertical?: boolean
  stepCount?: number
}

const StepsContext = React.createContext<StepperContextValue>({
  activeStep: 0,
})

export const useStepperContext = () => React.useContext(StepsContext)

export const StepperProvider: React.FC<{
  value: StepperContextValue
  children: React.ReactNode
}> = ({ value, children }) => {
  const isError = value.state === "error"
  const isLoading = value.state === "loading"

  const isVertical = value.orientation === "vertical"
  const isLabelVertical =
    value.orientation !== "vertical" && value.labelOrientation === "vertical"

  return (
    <StepsContext.Provider
      value={{
        ...value,
        isError,
        isLoading,
        isVertical,
        isLabelVertical,
      }}
    >
      {children}
    </StepsContext.Provider>
  )
}

/********** Stepper **********/

export interface StepperProps {
  activeStep: number
  orientation?: "vertical" | "horizontal"
  state?: "loading" | "error"
  responsive?: boolean
  onClickStep?: (step: number) => void
  successIcon?: React.ReactElement
  errorIcon?: React.ReactElement
  labelOrientation?: "vertical" | "horizontal"
  children?: React.ReactNode
  variant?: "default" | "ghost" | "outline" | "secondary"
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      activeStep = 0,
      state,
      responsive = true,
      orientation: orientationProp = "horizontal",
      onClickStep,
      labelOrientation = "horizontal",
      children,
      errorIcon,
      successIcon,
      variant = "default",
    },
    ref
  ) => {
    const childArr = React.Children.toArray(children)

    const stepCount = childArr.length

    const renderHorizontalContent = () => {
      if (activeStep <= childArr.length) {
        return React.Children.map(childArr[activeStep], (node) => {
          if (!React.isValidElement(node)) return
          return React.Children.map(
            node.props.children,
            (childNode) => childNode
          )
        })
      }
      return null
    }

    const isClickable = !!onClickStep

    const isMobile = useMediaQuery("(max-width: 43em)")

    const orientation = isMobile && responsive ? "vertical" : orientationProp

    return (
      <StepperProvider
        value={{
          activeStep,
          orientation,
          state,
          responsive,
          onClickStep,
          labelOrientation,
          isClickable,
          stepCount,
          errorIcon,
          successIcon,
          variant,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "flex w-full flex-1 justify-between gap-4 text-center",
            orientation === "vertical" ? "flex-col" : "flex-row"
          )}
        >
          {React.Children.map(children, (child, i) => {
            const isCompletedStep =
              (React.isValidElement(child) && child.props.isCompletedStep) ??
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
        </div>
        {orientation === "horizontal" && renderHorizontalContent()}
      </StepperProvider>
    )
  }
)

Stepper.displayName = "Stepper"

/********** StepperStep **********/

const stepVariants = cva("flex-row flex relative gap-2", {
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
      class: "flex-col items-start flex-[1_0_auto] w-full justify-start",
    },
  ],
})

export interface StepperConfig extends StepperStepLabelProps {
  icon?: React.ReactElement
}

export interface StepperStepProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepVariants>,
    StepperConfig {
  isCompletedStep?: boolean
}

interface StepperStepStatus {
  index: number
  isCompletedStep?: boolean
  isCurrentStep?: boolean
}

interface StepperStepAndStatusProps
  extends StepperStepProps,
    StepperStepStatus {}

export const StepperStep = React.forwardRef<
  HTMLDivElement,
  StepperStepAndStatusProps
>((props, ref) => {
  const {
    children,
    description,
    icon: CustomIcon,
    index,
    isCompletedStep,
    isCurrentStep,
    isLastStep,
    label,
    optional,
    optionalLabel,
  } = props

  const {
    isVertical,
    isError,
    isLoading,
    successIcon: CustomSuccessIcon,
    errorIcon: CustomErrorIcon,
    isLabelVertical,
    onClickStep,
    isClickable,
    variant,
  } = useStepperContext()

  const hasVisited = isCurrentStep || isCompletedStep

  const handleClick = (index: number) => {
    if (isClickable && onClickStep) {
      onClickStep(index)
    }
  }

  const Icon = React.useMemo(() => CustomIcon ?? null, [CustomIcon])

  const Success = React.useMemo(
    () => CustomSuccessIcon ?? <Check />,
    [CustomSuccessIcon]
  )

  const Error = React.useMemo(() => CustomErrorIcon ?? <X />, [CustomErrorIcon])

  const RenderIcon = React.useMemo(() => {
    if (isCompletedStep) return Success
    if (isCurrentStep) {
      if (isError) return Error
      if (isLoading) return <Loader2 className="animate-spin" />
    }
    if (Icon) return Icon
    return (index || 0) + 1
  }, [
    isCompletedStep,
    Success,
    isCurrentStep,
    Icon,
    index,
    isError,
    Error,
    isLoading,
  ])

  return (
    <div
      className={stepVariants({
        isLastStep,
        isVertical,
        isClickable: isClickable && !!onClickStep,
      })}
      ref={ref}
      onClick={() => handleClick(index)}
      aria-disabled={!hasVisited}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          isLabelVertical ? "flex-col" : ""
        )}
      >
        <Button
          aria-current={isCurrentStep ? "step" : undefined}
          data-invalid={isCurrentStep && isError}
          data-highlighted={isCompletedStep}
          data-clickable={isClickable}
          disabled={!(hasVisited || isClickable)}
          className={cn(
            "h-12 w-12 rounded-full data-[highlighted=true]:bg-green-700 data-[highlighted=true]:text-white",
            isCompletedStep || typeof RenderIcon !== "number" ? "px-3 py-2" : ""
          )}
          variant={isCurrentStep && isError ? "destructive" : variant}
        >
          {RenderIcon}
        </Button>
        <StepperStepLabel
          label={label}
          description={description}
          optional={optional}
          optionalLabel={optionalLabel}
          {...{ isCurrentStep }}
        />
      </div>
      <StepperStepConnector
        index={index}
        isLastStep={isLastStep}
        hasLabel={!!label || !!description}
        isCompletedStep={isCompletedStep || false}
      >
        {(isCurrentStep || isCompletedStep) && children}
      </StepperStepConnector>
    </div>
  )
})

StepperStep.displayName = "StepperStep"

/********** StepperStepLabel **********/

interface StepperStepLabelProps {
  label: string | React.ReactNode
  description?: string | React.ReactNode
  optional?: boolean
  optionalLabel?: string | React.ReactNode
}

const StepperStepLabel = ({
  isCurrentStep,
  label,
  description,
  optional,
  optionalLabel,
}: StepperStepLabelProps & {
  isCurrentStep?: boolean
}) => {
  const { isLabelVertical } = useStepperContext()

  const shouldRender = !!label || !!description

  const renderOptionalLabel = !!optional && !!optionalLabel

  return shouldRender ? (
    <div
      aria-current={isCurrentStep ? "step" : undefined}
      className={cn(
        "flex w-max flex-col justify-center",
        isLabelVertical ? "items-center text-center" : "items-start text-left"
      )}
    >
      {!!label && (
        <p>
          {label}
          {renderOptionalLabel && (
            <span className="ml-1 text-xs text-muted-foreground">
              ({optionalLabel})
            </span>
          )}
        </p>
      )}
      {!!description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  ) : null
}

StepperStepLabel.displayName = "StepperStepLabel"

/********** StepperStepConnector **********/

interface StepperStepConnectorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isCompletedStep: boolean
  isLastStep?: boolean | null
  hasLabel?: boolean
  index: number
}

const StepperStepConnector = React.memo(
  ({ isCompletedStep, children, isLastStep }: StepperStepConnectorProps) => {
    const { isVertical } = useStepperContext()

    if (isVertical) {
      return (
        <div
          data-highlighted={isCompletedStep}
          className={cn(
            "ms-6 mt-1 flex h-auto min-h-[2rem] flex-1 self-stretch border-l-2 ps-8",
            isLastStep ? "min-h-0 border-transparent" : "",
            isCompletedStep ? "border-green-700" : ""
          )}
        >
          {!isCompletedStep && (
            <div className="my-4 block h-auto w-full">{children}</div>
          )}
        </div>
      )
    }

    if (isLastStep) {
      return null
    }

    return (
      <Separator
        data-highlighted={isCompletedStep}
        className="flex h-[2px] min-h-[auto] flex-1 self-auto data-[highlighted=true]:bg-green-700"
        orientation={isVertical ? "vertical" : "horizontal"}
      />
    )
  }
)

StepperStepConnector.displayName = "StepperStepConnector"
