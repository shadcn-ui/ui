"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import * as Stepperize from "@stepperize/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"

type StepperVariant = "horizontal" | "vertical" | "circle"
type StepperLabelOrientation = "horizontal" | "vertical"

type StepperConfig<T extends Stepperize.Step[]> = {
  instance: ReturnType<typeof Stepperize.defineStepper<T>>
  variant?: StepperVariant
  labelOrientation?: StepperLabelOrientation
  tracking?: boolean
}

type StepperProviderProps<T extends Stepperize.Step[]> = StepperConfig<T> & {
  children: React.ReactNode
}

const StepContext = React.createContext<StepperConfig<any> | null>(null)

const StepperProvider = <T extends Stepperize.Step[]>({
  children,
  ...props
}: StepperProviderProps<T>) => {
  const { instance } = props
  const Scoped = instance.Scoped
  return (
    <Scoped>
      <StepContext.Provider value={props}>{children}</StepContext.Provider>
    </Scoped>
  )
}

const useStepper = <T extends Stepperize.Step[]>(): StepperConfig<T> => {
  const context = React.useContext(StepContext)
  if (!context) {
    throw new Error("useStepper must be used within a StepperProvider.")
  }
  return context
}

type StepperProps<T extends Stepperize.Step[]> = StepperConfig<T> &
  Omit<React.ComponentProps<"div">, "children"> & {
    children:
      | React.ReactNode
      | ((props: { methods: Stepperize.Stepper<T> }) => React.ReactNode)
  }

const Stepper = <T extends Stepperize.Step[]>({
  children,
  variant = "horizontal",
  labelOrientation = "horizontal",
  tracking = false,
  instance,
  ...props
}: StepperProps<T>) => (
  <StepperProvider
    instance={instance}
    variant={variant}
    labelOrientation={labelOrientation}
    tracking={tracking}
  >
    <StepperContainer {...props}>{children}</StepperContainer>
  </StepperProvider>
)

const StepperContainer = <T extends Stepperize.Step[]>({
  children,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  children:
    | React.ReactNode
    | ((props: { methods: Stepperize.Stepper<T> }) => React.ReactNode)
}) => {
  const { instance } = useStepper<T>()
  const methods = instance.useStepper()

  return (
    <div className={cn("stepper w-full", className)} {...props}>
      {typeof children === "function" ? children({ methods }) : children}
    </div>
  )
}

const StepperNavigation = ({
  children,
  className,
  "aria-label": ariaLabel = "Stepper Navigation",
  ...props
}: Omit<React.ComponentProps<"nav">, "children"> & {
  children: React.ReactNode
}) => {
  const { variant } = useStepper()

  return (
    <nav
      aria-label={ariaLabel}
      role="tablist"
      className={cn("stepper-navigation", className)}
      {...props}
    >
      <ol className={listVariants({ variant: variant })}>{children}</ol>
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
}: React.ComponentProps<"button"> & { of: T; icon?: Icon }) => {
  const { instance, variant, labelOrientation } = useStepper()

  const methods = instance.useStepper()

  const currentStep = methods.current

  const isLast = instance.utils.getLast().id === of.id
  const stepIndex = instance.utils.getIndex(of.id)
  const currentIndex = instance.utils.getIndex(currentStep?.id ?? "")
  const isActive = currentStep?.id === of.id

  const dataState = getStepState(currentIndex, stepIndex)
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
      <li
        className={cn([
          "stepper-step group peer relative flex items-center gap-2",
          "data-[variant=vertical]:flex-row",
          "data-[label-orientation=vertical]:w-full",
          "data-[label-orientation=vertical]:flex-col",
          "data-[label-orientation=vertical]:justify-center",
        ])}
        data-variant={variant}
        data-label-orientation={labelOrientation}
        data-state={dataState}
        data-disabled={props.disabled}
      >
        <Button
          id={`step-${of.id}`}
          type="button"
          role="tab"
          tabIndex={dataState !== "inactive" ? 0 : -1}
          className="stepper-step-indicator rounded-full"
          variant={dataState !== "inactive" ? "default" : "secondary"}
          size="icon"
          aria-controls={`step-panel-${of.id}`}
          aria-current={isActive ? "step" : undefined}
          aria-posinset={stepIndex + 1}
          aria-setsize={methods.all.length}
          aria-selected={isActive}
          onKeyDown={(e) =>
            onStepKeyDown(
              e,
              instance.utils.getNext(of.id),
              instance.utils.getPrev(of.id)
            )
          }
          {...props}
        >
          {icon ?? stepIndex + 1}
        </Button>
        {variant === "horizontal" && labelOrientation === "vertical" && (
          <StepperSeparator
            orientation="horizontal"
            labelOrientation={labelOrientation}
            isLast={isLast}
            state={dataState}
            disabled={props.disabled}
          />
        )}
        <div className="stepper-step-content flex flex-col items-start">
          {title}
          {description}
        </div>
      </li>

      {variant === "horizontal" && labelOrientation === "horizontal" && (
        <StepperSeparator
          orientation="horizontal"
          isLast={isLast}
          state={dataState}
          disabled={props.disabled}
        />
      )}

      {variant === "vertical" && (
        <div className="flex gap-4">
          {!isLast && (
            <div className="flex justify-center ps-5">
              <StepperSeparator
                orientation="vertical"
                isLast={isLast}
                state={dataState}
                disabled={props.disabled}
              />
            </div>
          )}
          <div className="my-3 flex-1 ps-4">{panel}</div>
        </div>
      )}
    </>
  )
}

const StepperSeparator = ({
  orientation,
  isLast,
  labelOrientation,
  state,
  disabled,
}: {
  isLast: boolean
  state: string
  disabled?: boolean
} & VariantProps<typeof classForSeparator>) => {
  if (isLast) {
    return null
  }
  return (
    <div
      data-orientation={orientation}
      data-state={state}
      data-disabled={disabled}
      role="separator"
      tabIndex={-1}
      className={classForSeparator({ orientation, labelOrientation })}
    />
  )
}

const classForSeparator = cva(
  [
    "bg-muted",
    "data-[state=completed]:bg-primary data-[disabled]:opacity-50",
    "transition-all duration-300 ease-in-out",
  ],
  {
    variants: {
      orientation: {
        horizontal: "h-0.5 flex-1",
        vertical: "h-full w-0.5",
      },
      labelOrientation: {
        vertical:
          "absolute left-[calc(50%+30px)] right-[calc(-50%+20px)] top-5 block shrink-0",
      },
    },
  }
)

const onStepKeyDown = (
  e: React.KeyboardEvent<HTMLButtonElement>,
  nextStep: Stepperize.Step,
  prevStep: Stepperize.Step
) => {
  const { key } = e
  const directions = {
    next: ["ArrowRight", "ArrowDown"],
    prev: ["ArrowLeft", "ArrowUp"],
  }

  if (directions.next.includes(key) || directions.prev.includes(key)) {
    const direction = directions.next.includes(key) ? "next" : "prev"
    const step = direction === "next" ? nextStep : prevStep

    if (!step) {
      return
    }

    const stepElement = document.getElementById(`step-${step.id}`)
    if (!stepElement) {
      return
    }

    const isActive =
      stepElement.parentElement?.getAttribute("data-state") !== "inactive"
    if (isActive || direction === "prev") {
      stepElement.focus()
    }
  }
}

const getStepState = (currentIndex: number, stepIndex: number) => {
  if (currentIndex === stepIndex) {
    return "active"
  }
  if (currentIndex > stepIndex) {
    return "completed"
  }
  return "inactive"
}

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
}: React.ComponentProps<"h4"> & { asChild?: boolean }) => {
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
}: React.ComponentProps<"p"> & { asChild?: boolean }) => {
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
    <div
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      tabIndex={-1}
      className="stepper-step-indicator relative inline-flex items-center justify-center"
    >
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

const StepperPanel = ({
  children,
  className,
  asChild,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) => {
  const Comp = asChild ? Slot : "div"
  const { tracking } = useStepper()

  return (
    <Comp
      className={cn("stepper-panel flex-1", className)}
      ref={(node) => scrollIntoStepperPanel(node, tracking)}
      {...props}
    >
      {children}
    </Comp>
  )
}

function scrollIntoStepperPanel(
  node: HTMLDivElement | null,
  tracking?: boolean
) {
  if (tracking) {
    node?.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

const StepperControls = ({
  children,
  asChild,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp className="stepper-controls flex justify-end gap-4" {...props}>
      {children}
    </Comp>
  )
}

const defineStepper: typeof Stepperize.defineStepper = Stepperize.defineStepper

export {
  defineStepper,
  Stepper,
  StepperControls,
  StepperDescription,
  StepperNavigation,
  StepperPanel,
  StepperStep,
  StepperTitle,
}
