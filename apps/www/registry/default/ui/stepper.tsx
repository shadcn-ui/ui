import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import { Check, Loader2, X } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "./button"
import { Separator } from "./separator"
import { useMediaQuery } from "./use-stepper"

/********** StepperContext **********/

interface StepperContextValue extends StepperProps {
  isClickable?: boolean
  isError?: boolean
  isLoading?: boolean
  isVertical?: boolean
  isLabelVertical?: boolean
  stepCount?: number
}

const StepperContext = React.createContext<StepperContextValue>({
  activeStep: 0,
})

export const useStepperContext = () => React.useContext(StepperContext)

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
    <StepperContext.Provider
      value={{
        ...value,
        isError,
        isLoading,
        isVertical,
        isLabelVertical,
      }}
    >
      {children}
    </StepperContext.Provider>
  )
}

/********** Stepper **********/

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
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
      className,
      ...props
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
          {...props}
          ref={ref}
          className={cn(
            "flex w-full flex-1 justify-between gap-4 text-center",
            orientation === "vertical" ? "flex-col" : "flex-row",
            className
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

/********** StepperItem **********/

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

export interface StepperConfig extends StepperItemLabelProps {
  icon?: React.ReactElement
}

interface StepProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperItemVariants>,
    StepperConfig {
  isCompletedStep?: boolean
}

interface StepperItemStatus {
  index: number
  isCompletedStep?: boolean
  isCurrentStep?: boolean
}

export interface StepperItemProps extends StepProps, StepperItemStatus {
  additionalClassName?: {
    button?: string
    label?: string
    description?: string
  }
}

export const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  (props, ref) => {
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
      className,
      additionalClassName,
      ...rest
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

    const Error = React.useMemo(
      () => CustomErrorIcon ?? <X />,
      [CustomErrorIcon]
    )

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
        {...rest}
        className={cn(
          stepperItemVariants({
            isLastStep,
            isVertical,
            isClickable: isClickable && !!onClickStep,
          }),
          className
        )}
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
            disabled={!hasVisited}
            className={cn(
              "aspect-square h-12 w-12 rounded-full data-[highlighted=true]:bg-green-700 data-[highlighted=true]:text-white",
              isCompletedStep || typeof RenderIcon !== "number"
                ? "px-3 py-2"
                : "",
              additionalClassName?.button
            )}
            variant={isCurrentStep && isError ? "destructive" : variant}
          >
            {RenderIcon}
          </Button>
          <StepperItemLabel
            label={label}
            description={description}
            optional={optional}
            optionalLabel={optionalLabel}
            labelClassName={additionalClassName?.label}
            descriptionClassName={additionalClassName?.description}
            {...{ isCurrentStep }}
          />
        </div>
        <StepperItemConnector
          index={index}
          isLastStep={isLastStep}
          hasLabel={!!label || !!description}
          isCompletedStep={isCompletedStep || false}
        >
          {(isCurrentStep || isCompletedStep) && children}
        </StepperItemConnector>
      </div>
    )
  }
)

StepperItem.displayName = "StepperItem"

/********** StepperItemLabel **********/

interface StepperItemLabelProps {
  label: string | React.ReactNode
  description?: string | React.ReactNode
  optional?: boolean
  optionalLabel?: string | React.ReactNode
  labelClassName?: string
  descriptionClassName?: string
}

const StepperItemLabel = ({
  isCurrentStep,
  label,
  description,
  optional,
  optionalLabel,
  labelClassName,
  descriptionClassName,
}: StepperItemLabelProps & {
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
        <p className={labelClassName}>
          {label}
          {renderOptionalLabel && (
            <span className="ml-1 text-xs text-muted-foreground">
              ({optionalLabel})
            </span>
          )}
        </p>
      )}
      {!!description && (
        <p
          className={cn("text-sm text-muted-foreground", descriptionClassName)}
        >
          {description}
        </p>
      )}
    </div>
  ) : null
}

StepperItemLabel.displayName = "StepperItemLabel"

/********** StepperItemConnector **********/

interface StepperItemConnectorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isCompletedStep: boolean
  isLastStep?: boolean | null
  hasLabel?: boolean
  index: number
}

const StepperItemConnector = React.memo(
  ({ isCompletedStep, children, isLastStep }: StepperItemConnectorProps) => {
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

StepperItemConnector.displayName = "StepperItemConnector"
