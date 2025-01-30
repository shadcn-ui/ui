import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import { Label } from "@/registry/default/ui/label"
import { RadioGroup, RadioGroupItem } from "@/registry/default/ui/radio-group"
import {
  Stepper,
  StepperControls,
  StepperNavigation,
  StepperPanel,
  StepperStep,
  StepperTitle,
  defineStepper,
} from "@/registry/default/ui/stepper"

type Variant = "horizontal" | "vertical" | "circle"

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
  }
)

export default function StepperVariants() {
  const [variant, setVariant] = React.useState<Variant>("horizontal")
  return (
    <div className="flex w-full flex-col gap-8">
      <RadioGroup
        value={variant}
        onValueChange={(value) => setVariant(value as Variant)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="horizontal" id="horizontal-variant" />
          <Label htmlFor="horizontal-variant">Horizontal</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="vertical" id="vertical-variant" />
          <Label htmlFor="vertical-variant">Vertical</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="circle" id="circle-variant" />
          <Label htmlFor="circle-variant">Circle</Label>
        </div>
      </RadioGroup>
      {variant === "horizontal" && <HorizontalStepper />}
      {variant === "vertical" && <VerticalStepper />}
      {variant === "circle" && <CircleStepper />}
    </div>
  )
}

const HorizontalStepper = () => {
  const steps = stepperInstance.steps
  return (
    <Stepper
      instance={stepperInstance}
      className="space-y-4"
      variant="horizontal"
    >
      {({ methods }) => (
        <React.Fragment>
          <StepperNavigation>
            {steps.map((step) => (
              <StepperStep
                key={step.id}
                of={step}
                onClick={() => methods.goTo(step.id)}
              >
                <StepperTitle>{step.title}</StepperTitle>
              </StepperStep>
            ))}
          </StepperNavigation>
          {methods.switch({
            "step-1": (step) => <Content id={step.id} />,
            "step-2": (step) => <Content id={step.id} />,
            "step-3": (step) => <Content id={step.id} />,
          })}
          <StepperControls>
            {!methods.isLast && (
              <Button
                variant="secondary"
                onClick={methods.prev}
                disabled={methods.isFirst}
              >
                Previous
              </Button>
            )}
            <Button onClick={methods.isLast ? methods.reset : methods.next}>
              {methods.isLast ? "Reset" : "Next"}
            </Button>
          </StepperControls>
        </React.Fragment>
      )}
    </Stepper>
  )
}

const Content = ({ id }: { id: string }) => {
  return (
    <StepperPanel className="h-[200px] content-center rounded border bg-slate-50 p-8">
      <p className="text-xl font-normal">Content for {id}</p>
    </StepperPanel>
  )
}

const VerticalStepper = () => {
  return (
    <Stepper
      instance={stepperInstance}
      className="space-y-4"
      variant="vertical"
    >
      {({ methods }) => (
        <>
          <StepperNavigation>
            {methods.all.map((step) => (
              <StepperStep
                key={step.id}
                of={step}
                onClick={() => methods.goTo(step.id)}
              >
                <StepperTitle>{step.title}</StepperTitle>
                {methods.when(step.id, () => (
                  <StepperPanel className="h-[200px] content-center rounded border bg-slate-50 p-8">
                    <p className="text-xl font-normal">Content for {step.id}</p>
                  </StepperPanel>
                ))}
              </StepperStep>
            ))}
          </StepperNavigation>
          <StepperControls>
            {!methods.isLast && (
              <Button
                variant="secondary"
                onClick={methods.prev}
                disabled={methods.isFirst}
              >
                Previous
              </Button>
            )}
            <Button onClick={methods.isLast ? methods.reset : methods.next}>
              {methods.isLast ? "Reset" : "Next"}
            </Button>
          </StepperControls>
        </>
      )}
    </Stepper>
  )
}

const CircleStepper = () => {
  return (
    <Stepper instance={stepperInstance} className="space-y-4" variant="circle">
      {({ methods }) => (
        <React.Fragment>
          <StepperNavigation>
            <StepperStep of={methods.current}>
              <StepperTitle>{methods.current.title}</StepperTitle>
            </StepperStep>
          </StepperNavigation>
          {methods.when(methods.current.id, () => (
            <StepperPanel className="h-[200px] content-center rounded border bg-slate-50 p-8">
              <p className="text-xl font-normal">
                Content for {methods.current.id}
              </p>
            </StepperPanel>
          ))}
          <StepperControls>
            {!methods.isLast && (
              <Button
                variant="secondary"
                onClick={methods.prev}
                disabled={methods.isFirst}
              >
                Previous
              </Button>
            )}
            <Button onClick={methods.isLast ? methods.reset : methods.next}>
              {methods.isLast ? "Reset" : "Next"}
            </Button>
          </StepperControls>
        </React.Fragment>
      )}
    </Stepper>
  )
}
