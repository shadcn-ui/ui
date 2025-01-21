"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import * as Stepperize from "@stepperize/react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/registry/new-york/ui/button"
import { Separator } from "@/registry/new-york/ui/separator"

type StepperProviderProps<T extends Stepperize.Step[]> = StepperConfig<T> & {
  children: React.ReactNode
}

type StepperVariant = "horizontal" | "vertical" | "circle"

type StepperConfig<T extends Stepperize.Step[]> = {
  instance: ReturnType<typeof Stepperize.defineStepper<T>>
  variant?: StepperVariant
}

const StepContext = React.createContext<StepperConfig<any>>({
  instance: {} as ReturnType<typeof Stepperize.defineStepper<any>>,
  variant: "horizontal",
})

const StepperProvider = <T extends Stepperize.Step[]>({
  children,
  ...props
}: StepperProviderProps<T>) => {
  const Scope = props.instance.Scoped
  return (
    <Scope>
      <StepContext.Provider value={props}>{children}</StepContext.Provider>
    </Scope>
  )
}

const useStepper = <T extends Stepperize.Step[]>(): StepperConfig<T> => {
  const context = React.useContext(StepContext)
  if (!context) {
    throw new Error("useStepper must be used within a Stepper")
  }
  return context
}

function Stepper<T extends Stepperize.Step[]>({
  children,
  variant = "horizontal",
  className,
  ...props
}: StepperConfig<T> & JSX.IntrinsicElements["div"]) {
  const { instance } = props

  return (
    <StepperProvider instance={instance} variant={variant}>
      <div className={cn("stepper w-full", className)} {...props}>
        {children}
      </div>
    </StepperProvider>
  )
}

const StepperNavigation = ({
  children,
  className,
  "aria-label": ariaLabel = "Checkout Steps",
  ...props
}: Omit<JSX.IntrinsicElements["nav"], "children"> & {
  children:
    | React.ReactNode
    | ((props: {
        methods: Stepperize.Stepper<Stepperize.Step[]>
      }) => React.ReactNode)
}) => {
  const { variant, instance } = useStepper()

  const methods = instance.useStepper() as Stepperize.Stepper<Stepperize.Step[]>

  return (
    <nav
      aria-label={ariaLabel}
      className={cn("stepper-navigation", className)}
      {...props}
    >
      <ol className={listVariants({ variant: variant })}>
        {typeof children === "function" ? children({ methods }) : children}
      </ol>
    </nav>
  )
}

const listVariants = cva("stepper-navigation-list flex gap-2", {
  variants: {
    variant: {
      horizontal: "flex-row items-center justify-between",
      vertical: "flex-col",
      circle: "flex-row items-center justify-between",
    },
  },
})

const StepperStep = <T extends Stepperize.Step, Icon extends React.ReactNode>({
  children,
  className,
  of,
  icon,
  ...props
}: JSX.IntrinsicElements["button"] & { of: T; icon?: Icon }) => {
  const { instance, variant } = useStepper()
  const methods = instance.useStepper() as Stepperize.Stepper<Stepperize.Step[]>

  const currentStep = methods.current

  const isLast = instance.utils.getLast().id === of.id
  const stepIndex = instance.utils.getIndex(of.id)
  const currentIndex = instance.utils.getIndex(currentStep?.id ?? "")
  const isCurrent = currentStep?.id === of.id

  const childMap = useStepChildren(children)

  const title = childMap.get("title")
  const description = childMap.get("description")
  const panel = childMap.get("panel")

  if (variant === "circle") {
    return (
      <li
        className={cn(
          "stepper-step flex shrink-0 items-center gap-4 rounded-md transition-colors",
          className
        )}
      >
        <CircleStepIndicator
          currentStep={stepIndex + 1}
          totalSteps={instance.steps.length}
        />
        <div className="stepper-step-content flex flex-col items-start gap-1">
          {title}
          {description}
        </div>
      </li>
    )
  }

  return (
    <>
      <li className="stepper-step flex items-center gap-4">
        <button
          type="button"
          role="tab"
          className={stepVariants()}
          aria-current={isCurrent ? "step" : undefined}
          aria-posinset={stepIndex + 1}
          aria-setsize={methods.all.length}
          aria-selected={isCurrent}
          {...props}
        >
          <DefaultStepIndicator
            stepIndex={stepIndex}
            fill={currentIndex >= stepIndex}
            icon={icon}
          />
          <div className="stepper-step-content flex flex-col items-start">
            {title}
            {description}
          </div>
        </button>
      </li>

      {variant === "horizontal" && !isLast && (
        <Separator
          className={cn(
            "flex-1",
            "transition-all duration-300 ease-in-out",
            stepIndex < currentIndex ? "bg-primary" : "bg-muted"
          )}
        />
      )}

      {variant === "vertical" && (
        <div className="flex gap-4" data-last={isLast}>
          {!isLast && (
            <div className="flex justify-center ps-5">
              <Separator
                orientation="vertical"
                className={cn(
                  "h-full w-[1px]",
                  "transition-all duration-300 ease-in-out",
                  stepIndex < currentIndex ? "bg-primary" : "bg-muted"
                )}
              />
            </div>
          )}
          <div className="my-3 flex-1 ps-4">{panel}</div>
        </div>
      )}
    </>
  )
}

const stepVariants = cva(
  [
    "stepper-step-button flex shrink-0 items-center gap-2 rounded-md transition-colors",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-8 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        horizontal: "flex-col",
        vertical: "flex-row",
        circle: "flex-row",
      },
    },
  }
)

const extractChildren = (children: React.ReactNode) => {
  const childrenArray = React.Children.toArray(children)
  const map = new Map<string, React.ReactNode>()

  for (const child of childrenArray) {
    if (React.isValidElement(child)) {
      if (child.type === StepperTitle) {
        map.set("title", child)
      } else if (child.type === StepperDescription) {
        map.set("description", child)
      } else if (child.type === StepperPanel) {
        map.set("panel", child)
      }
    }
  }

  return map
}

const useStepChildren = (children: React.ReactNode) => {
  return React.useMemo(() => extractChildren(children), [children])
}

const StepperTitle = ({
  children,
  className,
  asChild,
  ...props
}: JSX.IntrinsicElements["h4"] & { asChild?: boolean }) => {
  const Comp = asChild ? Slot : "h4"

  return (
    <Comp
      className={cn("stepper-step-title text-base font-medium", className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

const StepperDescription = ({
  children,
  className,
  asChild,
  ...props
}: JSX.IntrinsicElements["p"] & { asChild?: boolean }) => {
  const Comp = asChild ? Slot : "p"

  return (
    <Comp
      className={cn(
        "stepper-step-description text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

const DefaultStepIndicator = ({
  stepIndex,
  fill,
  icon,
}: {
  stepIndex: number
  fill: boolean
  icon: React.ReactNode
}) => (
  <span
    className={cn(
      buttonVariants({ variant: fill ? "default" : "secondary", size: "icon" }),
      "stepper-step-indicator rounded-full transition-all duration-300 ease-in-out"
    )}
  >
    {icon ?? stepIndex + 1}
  </span>
)

type CircleStepIndicatorProps = {
  currentStep: number
  totalSteps: number
  size?: number
  strokeWidth?: number
}

const CircleStepIndicator = ({
  currentStep,
  totalSteps,
  size = 80,
  strokeWidth = 6,
}: CircleStepIndicatorProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const fillPercentage = (currentStep / totalSteps) * 100
  const dashOffset = circumference - (circumference * fillPercentage) / 100

  return (
    <div className="stepper-step-container relative inline-flex items-center justify-center">
      <svg width={size} height={size}>
        <title>Step Indicator</title>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted-foreground"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="text-primary transition-all duration-300 ease-in-out"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium" aria-live="polite">
          {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  )
}

const StepperPanel = <T extends Stepperize.Step>({
  children,
  className,
  when,
  asChild,
  ...props
}: Omit<JSX.IntrinsicElements["div"], "children"> & {
  asChild?: boolean
  when: T
  children:
    | React.ReactNode
    | ((props: {
        step: T
        methods: Stepperize.Stepper<Stepperize.Step[]>
        onBeforeAction: (
          action: StepAction,
          callback: (params: {
            prevStep: Stepperize.Step
            nextStep: Stepperize.Step
          }) => Promise<boolean> | boolean
        ) => void
      }) => React.ReactNode)
}) => {
  const Comp = asChild ? Slot : "div"
  const { instance } = useStepper()

  const methods = instance.useStepper()

  if (instance.utils.getIndex(when.id) === -1) {
    throw new Error(`Step ${when.id} does not exist in the stepper instance`)
  }

  const onBeforeAction = React.useCallback(
    async (
      action: StepAction,
      callback: (params: {
        prevStep: Stepperize.Step
        nextStep: Stepperize.Step
      }) => Promise<boolean> | boolean
    ) => {
      const prevStep = methods.current
      const nextStep =
        action === "next"
          ? instance.utils.getNext(prevStep.id)
          : action === "prev"
          ? instance.utils.getPrev(prevStep.id)
          : instance.utils.getFirst()

      const shouldProceed = await callback({ prevStep, nextStep })
      if (shouldProceed) {
        if (action === "next") methods.next()
        if (action === "prev") methods.prev()
        if (action === "reset") methods.reset()
      }
    },
    [methods, instance.utils]
  )

  return (
    <>
      {methods.when(when.id, (step) => (
        <Comp className={cn("stepper-panel flex-1", className)} {...props}>
          {typeof children === "function"
            ? children({ step: step as T, methods, onBeforeAction })
            : children}
        </Comp>
      ))}
    </>
  )
}

const StepperControls = ({
  children,
  asChild,
  className,
  ...props
}: Omit<JSX.IntrinsicElements["div"], "children"> & {
  asChild?: boolean
  children:
    | React.ReactNode
    | ((props: {
        methods: Stepperize.Stepper<Stepperize.Step[]>
      }) => React.ReactNode)
}) => {
  const Comp = asChild ? Slot : "div"
  const { instance } = useStepper()

  const methods = instance.useStepper()

  return (
    <Comp
      className={cn("stepper-controls flex justify-end gap-4", className)}
      {...props}
    >
      {typeof children === "function" ? children({ methods }) : children}
    </Comp>
  )
}

type StepAction = "next" | "prev" | "reset"

type StepperActionProps = {
  action: StepAction
  children: React.ReactNode
  asChild?: boolean
  onBeforeAction?: ({
    event,
    prevStep,
    nextStep,
  }: {
    event: React.MouseEvent<HTMLButtonElement>
    prevStep: Stepperize.Step
    nextStep: Stepperize.Step
  }) => Promise<boolean> | boolean
  className?: string
}

const StepperAction = ({
  action,
  children,
  asChild = false,
  onBeforeAction,
  className,
  disabled,
  ...props
}: JSX.IntrinsicElements["button"] & StepperActionProps) => {
  const { instance } = useStepper()
  const methods = instance.useStepper()

  const currentStep = methods.current

  const isDisabled = (action: StepAction) =>
    action === "prev" && methods.isFirst

  const actionMap = React.useMemo(
    () => ({
      next: methods.next,
      prev: methods.prev,
      reset: methods.reset,
    }),
    [methods]
  )

  const handleClick = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onBeforeAction) {
        const nextStep =
          action === "next"
            ? instance.utils.getNext(currentStep.id)
            : action === "prev"
            ? instance.utils.getPrev(currentStep.id)
            : instance.utils.getFirst()
        const shouldProceed = await onBeforeAction({
          event,
          prevStep: currentStep,
          nextStep,
        })
        if (!shouldProceed) {
          return
        }
      }

      actionMap[action]?.()
    },
    [onBeforeAction, actionMap, action, instance.utils, currentStep]
  )

  const Comp = asChild ? Slot : Button

  if (
    (methods.isLast && (action === "next" || action === "prev")) ||
    (!methods.isLast && action === "reset")
  ) {
    return null
  }

  return (
    <Comp
      onClick={handleClick}
      variant={action === "prev" ? "secondary" : "default"}
      disabled={isDisabled(action) || disabled}
      className={cn("stepper-action", className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

const defineStepper: typeof Stepperize.defineStepper = Stepperize.defineStepper

export {
  Stepper,
  StepperAction,
  StepperControls,
  StepperDescription,
  StepperNavigation,
  StepperPanel,
  StepperStep,
  StepperTitle,
  defineStepper,
}
