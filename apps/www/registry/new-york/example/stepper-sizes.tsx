import * as React from "react"

import { Button } from "@/registry/new-york/ui/button"
import { Label } from "@/registry/new-york/ui/label"
import { RadioGroup, RadioGroupItem } from "@/registry/new-york/ui/radio-group"
import {
  Step,
  StepItem,
  Stepper,
  StepperProps,
  useStepper,
} from "@/registry/new-york/ui/stepper"

const steps = [
  { label: "Step 1" },
  { label: "Step 2" },
  { label: "Step 3" },
] satisfies StepItem[]

export default function StepperDemo() {
  const [size, setSize] = React.useState<StepperProps["size"]>("md")

  return (
    <div className="flex w-full flex-col gap-4">
      <RadioGroup
        className="mb-10"
        value={size}
        onValueChange={(value) => setSize(value as StepperProps["size"])}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sm" id="sm" />
          <Label htmlFor="sm">sm</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="md" id="md" />
          <Label htmlFor="md">md</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="lg" id="lg" />
          <Label htmlFor="lg">lg</Label>
        </div>
      </RadioGroup>
      <Stepper size={size} initialStep={0} steps={steps}>
        {steps.map(({ label }, index) => {
          return (
            <Step key={label} label={label}>
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
    reset,
    activeStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptional,
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
          <Button size="sm" onClick={reset}>
            Reset
          </Button>
        ) : (
          <>
            <Button
              disabled={activeStep === 0}
              onClick={prevStep}
              size="sm"
              variant="secondary"
            >
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {isLastStep ? "Finish" : isOptional ? "Skip" : "Next"}
            </Button>
          </>
        )}
      </div>
    </>
  )
}
