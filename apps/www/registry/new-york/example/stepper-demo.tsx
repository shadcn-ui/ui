import { useEffect, useRef } from "react"
import { Moon } from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"
import {
  Stepper,
  StepperFooter,
  StepperItem,
  useStepper,
} from "@/registry/new-york/ui/stepper"

const steps = [
  { label: "Step 1", description: "Testing" },
  { label: "Step 2" },
  { label: "Step 3" },
  // { label: "Step 4" },
  // { label: "Step 5" },
  // { label: "Step 6" },
  // { label: "Step 7" },
  // { label: "Step 8" },
  // { label: "Step 9" },
  // { label: "Step 10" },
]

export default function StepperDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper
        initialStep={0}
        steps={steps}
        orientation="vertical"
        status="loading"
      >
        {steps.map((step, index) => (
          <StepperItem key={index}>
            <div className="h-40 w-full rounded-lg bg-slate-100 p-4 text-slate-900 dark:bg-slate-300">
              <p>Step {index + 1} content</p>
            </div>
          </StepperItem>
        ))}
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
