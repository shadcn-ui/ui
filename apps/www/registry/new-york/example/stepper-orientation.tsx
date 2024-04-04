import * as React from "react"

import { Button } from "@/registry/new-york/ui/button"
import { Label } from "@/registry/new-york/ui/label"
import { RadioGroup, RadioGroupItem } from "@/registry/new-york/ui/radio-group"
import {
  Step,
  StepItem,
  Stepper,
  useStepper,
  type StepperProps,
} from "@/registry/new-york/ui/stepper"

const steps = [
  { label: "Step 1" },
  { label: "Step 2" },
  { label: "Step 3" },
] satisfies StepItem[]

export default function StepperDemo() {
  const [orientation, setOrientation] =
    React.useState<StepperProps["orientation"]>("vertical")

  return (
    <div className="flex w-full flex-col gap-4">
      <RadioGroup
        className="mb-10"
        value={orientation}
        onValueChange={(value) =>
          setOrientation(value as StepperProps["orientation"])
        }
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="horizontal" id="horizontal" />
          <Label htmlFor="horizontal">horizontal</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="vertical" id="vertical" />
          <Label htmlFor="vertical">vertical</Label>
        </div>
      </RadioGroup>
      <Stepper orientation={orientation} initialStep={0} steps={steps}>
        {steps.map((stepProps, index) => {
          return (
            <Step key={stepProps.label} {...stepProps}>
              <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
                <h1 className="text-xl">Step {index + 1}</h1>
              </div>
            </Step>
          )
        })}
        <Footer />
      </Stepper>
    </div>
  )
}

const Footer = () => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper()
  return (
    <>
      {hasCompletedAllSteps && (
        <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
          <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="w-full flex justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            Reset
          </Button>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary"
            >
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>
          </>
        )}
      </div>
    </>
  )
}
