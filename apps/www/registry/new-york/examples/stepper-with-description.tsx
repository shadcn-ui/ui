import {
  Stepper,
  StepperAction,
  StepperControls,
  StepperDescription,
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
    description: "This is the first step",
  },
  {
    id: "step-2",
    title: "Step 2",
    description: "This is the second step",
  },
  {
    id: "step-3",
    title: "Step 3",
    description: "This is the third step",
  }
)

export default function StepperWithDescription() {
  const steps = stepperInstance.steps
  return (
    <Stepper
      instance={stepperInstance}
      className="space-y-4"
      variant="vertical"
      labelOrientation="horizontal"
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
                <StepperDescription>{step.description}</StepperDescription>
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
  )
}
