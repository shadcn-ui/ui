import { Button } from "@/components/ui/button"
import { Step, StepConfig, Steps } from "@/components/ui/stepper"
import { useSteps } from "@/components/ui/use-steps"

const steps = [
  { label: "Step 1", description: "Frist description" },
  { label: "Step 2", description: "Second description" },
  { label: "Step 3", description: "Third description" },
] satisfies StepConfig[]

export const StepperWithLabelOrientation = () => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    activeStep,
    isDisabledStep,
    isLastStep,
    isOptionalStep,
  } = useSteps({
    initialStep: 0,
    steps,
  })

  return (
    <div className="flex w-full flex-col gap-4">
      <Steps labelOrientation="vertical" activeStep={activeStep}>
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
