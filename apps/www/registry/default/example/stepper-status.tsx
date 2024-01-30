import { useState } from "react"

import { Button } from "@/registry/default/ui/button"
import { Label } from "@/registry/default/ui/label"
import { RadioGroup, RadioGroupItem } from "@/registry/default/ui/radio-group"
import {
  Stepper,
  StepperFooter,
  StepperItem,
  useStepper,
} from "@/registry/default/ui/stepper"

const steps = [
  { id: 0, label: "Step 1" },
  { id: 1, label: "Step 2" },
  { id: 2, label: "Step 3" },
]

export default function StepperStates() {
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
      <StepperDemo status={value} />
    </div>
  )
}

function StepperDemo({
  status = "default",
}: {
  status?: "default" | "loading" | "error"
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper initialStep={0} steps={steps} status={status}>
        {steps.map((step, index) => {
          return (
            <StepperItem key={step.id}>
              <div className="h-40 w-full rounded-lg bg-slate-100 p-4 text-slate-900 dark:bg-slate-300">
                <p>Step {index + 1} content</p>
              </div>
            </StepperItem>
          )
        })}
        <StepperFooter>
          <MyStepperFooter />
        </StepperFooter>
      </Stepper>
    </div>
  )
}

function MyStepperFooter() {
  const {
    activeStep,
    isLastStep,
    isOptionalStep,
    isDisabledStep,
    nextStep,
    prevStep,
    resetSteps,
    steps,
  } = useStepper()

  return (
    <div className="flex items-center justify-end gap-2">
      {activeStep === steps.length ? (
        <>
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
  )
}
