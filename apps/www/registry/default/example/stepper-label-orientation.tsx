import { Button } from "@/registry/default/ui/button"
import {
  Stepper,
  StepperFooter,
  StepperItem,
  useStepper,
} from "@/registry/default/ui/stepper"

const steps = [
  { label: "Step 1", description: "Description 1" },
  { label: "Step 2", description: "Description 2" },
  { label: "Step 3", description: "Description 3" },
]

export default function StepperDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper initialStep={0} steps={steps} labelOrientation="vertical">
        {steps.map((step, index) => {
          return (
            <StepperItem key={index}>
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
