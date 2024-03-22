import { Button } from "@/registry/new-york/ui/button"
import {
  Step,
  StepItem,
  Stepper,
  useStepper,
} from "@/registry/new-york/ui/stepper"

const steps = [
  { label: "Step 1" },
  { label: "Step 2" },
  { label: "Step 3" },
] satisfies StepItem[]

export default function StepperDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper orientation="vertical" initialStep={0} steps={steps}>
        {steps.map(({ label }, index) => {
          return (
            <Step key={label} label={label}>
              <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
                <h1 className="text-xl">Step {index + 1}</h1>
              </div>
              <StepButtons />
            </Step>
          )
        })}
        <FinalStep />
      </Stepper>
    </div>
  )
}

const StepButtons = () => {
  const { nextStep, prevStep, activeStep, isLastStep, isOptional } =
    useStepper()
  return (
    <div className="w-full flex gap-2">
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
    </div>
  )
}

const FinalStep = () => {
  const { hasCompletedAllSteps, reset } = useStepper()

  if (!hasCompletedAllSteps) {
    return null
  }

  return (
    <>
      <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
        <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
      </div>
      <div className="w-full flex justify-end gap-2">
        <Button size="sm" onClick={reset}>
          Reset
        </Button>
      </div>
    </>
  )
}
