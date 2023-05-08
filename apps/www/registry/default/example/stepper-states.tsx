import { useState } from "react"

import { Button } from "@/registry/default/ui/button"
import { Label } from "@/registry/default/ui/label"
import { RadioGroup, RadioGroupItem } from "@/registry/default/ui/radio-group"
import { Step, StepConfig, Steps } from "@/registry/default/ui/stepper"
import { useStepper } from "@/registry/default/ui/use-stepper"

const steps = [
  { label: "Step 1" },
  { label: "Step 2" },
  { label: "Step 3" },
] satisfies StepConfig[]

export default function StepperStates() {
  const {
    nextStep,
    prevStep,
    resetSteps,
    activeStep,
    isDisabledStep,
    isLastStep,
    isOptionalStep,
  } = useStepper({
    initialStep: 0,
    steps,
  })

  const [value, setValue] = useState<"loading" | "error">("loading")

  return (
    <div className="flex w-full flex-col gap-4">
      <RadioGroup
        defaultValue="loading"
        value={value}
        onValueChange={(value) => setValue(value as "loading" | "error")}
        className="mb-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="loading" id="r1" />
          <Label htmlFor="r1">Loading</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="error" id="r2" />
          <Label htmlFor="r2">Error</Label>
        </div>
      </RadioGroup>
      <Steps state={value} activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step index={index} key={index} {...step}>
            <div className="h-40 w-full rounded-lg bg-slate-100 p-4 text-slate-900 dark:bg-slate-300">
              <p>Step {index + 1} content</p>
            </div>
          </Step>
        ))}
      </Steps>
      <div className="flex items-center justify-end gap-2">
        {activeStep === steps.length ? (
          <>
            <h2>All steps completed!</h2>
            <Button onClick={resetSteps}>Reset</Button>
          </>
        ) : (
          <>
            <Button disabled={isDisabledStep} onClick={prevStep}>
              Prev
            </Button>
            <Button onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
