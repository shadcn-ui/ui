import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/registry/new-york/ui/button"
import { defineStepper } from "@/registry/new-york/ui/stepper"

const {
  StepperProvider,
  StepperControls,
  StepperNavigation,
  StepperPanel,
  StepperStep,
  StepperTitle,
} = defineStepper(
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

export default function StepperResponsiveVariant() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  return (
    <StepperProvider
      className="space-y-4"
      variant={isMobile ? "vertical" : "horizontal"}
    >
      {({ methods }) => (
        <React.Fragment>
          <StepperNavigation>
            {methods.all.map((step) => (
              <StepperStep
                key={step.id}
                of={step.id}
                onClick={() => methods.goTo(step.id)}
              >
                <StepperTitle>{step.title}</StepperTitle>
                {isMobile &&
                  methods.when(step.id, (step) => (
                    <StepperPanel className="h-[200px] content-center rounded border bg-slate-50 p-8">
                      <p className="text-xl font-normal">
                        Content for {step.id}
                      </p>
                    </StepperPanel>
                  ))}
              </StepperStep>
            ))}
          </StepperNavigation>
          {!isMobile &&
            methods.switch({
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
    </StepperProvider>
  )
}

const Content = ({ id }: { id: string }) => {
  return (
    <StepperPanel className="h-[200px] content-center rounded border bg-slate-50 p-8">
      <p className="text-xl font-normal">Content for {id}</p>
    </StepperPanel>
  )
}
