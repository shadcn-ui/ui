import * as React from "react"

import { Label } from "@/registry/default/ui/label"
import { RadioGroup, RadioGroupItem } from "@/registry/default/ui/radio-group"
import {
  Stepper,
  StepperAction,
  StepperControls,
  StepperNavigation,
  StepperPanel,
  StepperStep,
  StepperTitle,
  defineStepper,
} from "@/registry/default/ui/stepper"

type LabelOrientation = "horizontal" | "vertical"

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

  const [labelOrientation, setLabelOrientation] =
    React.useState<LabelOrientation>("horizontal")
  return (
    <div className="flex w-full flex-col gap-8">
      <RadioGroup
        value={labelOrientation}
        onValueChange={(value) =>
          setLabelOrientation(value as LabelOrientation)
        }
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="horizontal" id="horizontal-label" />
          <Label htmlFor="horizontal-label">Horizontal</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="vertical" id="vertical-label" />
          <Label htmlFor="vertical-label">Vertical</Label>
        </div>
      </RadioGroup>
      <Stepper
        instance={stepperInstance}
        className="space-y-4"
        variant="horizontal"
        labelOrientation={labelOrientation}
      >
        {({ methods }) => (
          <>
            <StepperNavigation>
              {steps.map((step) => (
                <StepperStep
                  key={step.id}
                  of={step}
                  onClick={() => methods.goTo(step.id)}
                >
                  <StepperTitle>{step.title}</StepperTitle>
                </StepperStep>
              ))}
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
          </>
        )}
      </Stepper>
    </div>
  )
}
