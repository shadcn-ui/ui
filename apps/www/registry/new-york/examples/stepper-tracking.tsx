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
  },
  {
    id: "step-4",
    title: "Step 4",
  },
  {
    id: "step-5",
    title: "Step 5",
  },
  {
    id: "step-6",
    title: "Step 6",
  }
)

export default function StepperVerticalFollow() {
  const steps = stepperInstance.steps

  const [tracking, setTracking] = React.useState(false)
  return (
    <div className="flex w-full flex-col gap-8">
      <RadioGroup
        value={tracking.toString()}
        onValueChange={(value) => setTracking(value === "true")}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="tracking" />
          <Label htmlFor="tracking">Tracking</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="no-tracking" />
          <Label htmlFor="no-tracking">No Tracking</Label>
        </div>
      </RadioGroup>
      <Stepper
        instance={stepperInstance}
        className="space-y-4"
        variant="vertical"
        tracking={tracking}
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
                  <StepperPanel key={step.id} when={step} className="space-y-4">
                    <div className="h-[200px] content-center rounded border bg-slate-50 p-8">
                      <p className="text-xl font-normal">
                        Content for {step.id}
                      </p>
                    </div>
                    <StepperControls>
                      <StepperAction action="prev">Previous</StepperAction>
                      <StepperAction action="next">Next</StepperAction>
                      <StepperAction action="reset">Reset</StepperAction>
                    </StepperControls>
                  </StepperPanel>
                </StepperStep>
              ))}
            </StepperNavigation>
          </>
        )}
      </Stepper>
    </div>
  )
}
