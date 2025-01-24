import * as React from "react"

import { Label } from "@/registry/new-york/ui/label"
import { RadioGroup, RadioGroupItem } from "@/registry/new-york/ui/radio-group"
import {
  Stepper,
  StepperAction,
  StepperControls,
  StepperNavigation,
  StepperPanel,
  StepperStep,
  StepperTitle,
  defineStepper,
} from "@/registry/new-york/ui/stepper"

type Variant = "horizontal" | "vertical" | "circle"

const stepperInstance = defineStepper(
  {
    id: "step-1",
    title: "Step 1",
  },
  {
    id: "step-2",
    title: "Step 2",
  },
  {
    id: "step-3",
    title: "Step 3",
  }
)

export default function StepperVariants() {
  const steps = stepperInstance.steps

  const [variant, setVariant] = React.useState<Variant>("horizontal")
  return (
    <div className="flex w-full flex-col gap-8">
      <RadioGroup
        value={variant}
        onValueChange={(value) =>
          setVariant(value as "horizontal" | "vertical" | "circle")
        }
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="horizontal" id="r1" />
          <Label htmlFor="r1">Horizontal</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="vertical" id="r2" />
          <Label htmlFor="r2">Vertical</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="circle" id="r3" />
          <Label htmlFor="r3">Circle</Label>
        </div>
      </RadioGroup>
      {variant === "horizontal" && <HorizontalStepper />}
      {variant === "vertical" && <VerticalStepper />}
      {variant === "circle" && <CircleStepper />}
    </div>
  )
}

const HorizontalStepper = () => {
  const steps = stepperInstance.steps
  return (
    <Stepper
      instance={stepperInstance}
      className="space-y-4"
      variant="horizontal"
    >
      <StepperNavigation>
        {({ methods }) =>
          steps.map((step) => (
            <StepperStep
              key={step.id}
              of={step}
              onClick={() => methods.goTo(step.id)}
            >
              <StepperTitle>{step.title}</StepperTitle>
            </StepperStep>
          ))
        }
      </StepperNavigation>
      {steps.map((step) => (
        <StepperPanel
          key={step.id}
          when={step}
          className="h-[200px] content-center rounded border bg-slate-50 p-8"
        >
          {({ step }) => (
            <p className="text-xl font-normal">Content for {step.id}</p>
          )}
        </StepperPanel>
      ))}
      <StepperControls>
        <StepperAction action="prev">Previous</StepperAction>
        <StepperAction action="next">Next</StepperAction>
        <StepperAction action="reset">Reset</StepperAction>
      </StepperControls>
    </Stepper>
  )
}

const VerticalStepper = () => {
  const steps = stepperInstance.steps
  return (
    <Stepper
      instance={stepperInstance}
      className="space-y-4"
      variant="vertical"
    >
      <StepperNavigation>
        {({ methods }) =>
          steps.map((step) => (
            <>
              <StepperStep
                key={step.id}
                of={step}
                onClick={() => methods.goTo(step.id)}
              >
                <StepperTitle>{step.title}</StepperTitle>
                <StepperPanel
                  key={step.id}
                  when={step}
                  className="h-[200px] content-center rounded border bg-slate-50 p-8"
                >
                  {({ step }) => (
                    <p className="text-xl font-normal">Content for {step.id}</p>
                  )}
                </StepperPanel>
              </StepperStep>
            </>
          ))
        }
      </StepperNavigation>
      <StepperControls>
        <StepperAction action="prev">Previous</StepperAction>
        <StepperAction action="next">Next</StepperAction>
        <StepperAction action="reset">Reset</StepperAction>
      </StepperControls>
    </Stepper>
  )
}

const CircleStepper = () => {
  const steps = stepperInstance.steps
  return (
    <Stepper instance={stepperInstance} className="space-y-4" variant="circle">
      <StepperNavigation>
        {({ methods }) => (
          <StepperStep of={methods.current}>
            <StepperTitle>{methods.current.title}</StepperTitle>
          </StepperStep>
        )}
      </StepperNavigation>
      {steps.map((step) => (
        <StepperPanel
          key={step.id}
          when={step}
          className="h-[200px] content-center rounded border bg-slate-50 p-8"
        >
          {({ step }) => (
            <p className="text-xl font-normal">Content for {step.id}</p>
          )}
        </StepperPanel>
      ))}
      <StepperControls>
        <StepperAction action="prev">Previous</StepperAction>
        <StepperAction action="next">Next</StepperAction>
        <StepperAction action="reset">Reset</StepperAction>
      </StepperControls>
    </Stepper>
  )
}
