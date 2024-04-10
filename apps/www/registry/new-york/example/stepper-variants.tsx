import * as React from "react"

import { Button } from "@/registry/new-york/ui/button"
import { Label } from "@/registry/new-york/ui/label"
import { RadioGroup, RadioGroupItem } from "@/registry/new-york/ui/radio-group"
import {
  Step,
  StepItem,
  Stepper,
  useStepper,
  type StepperProps,
} from "@/registry/new-york/ui/stepper"

const steps = [
  { label: "Step 1" },
  { label: "Step 2" },
  { label: "Step 3" },
] satisfies StepItem[]

export default function StepperDemo() {
  const [variant, setVariant] =
    React.useState<StepperProps["variant"]>("circle")

  return (
    <div className="flex w-full flex-col gap-4">
			<RadioGroup
				className="mb-2 flex"
				value={variant}
				onValueChange={(value) => setVariant(value as StepperProps["variant"])}
			>
				<Label
					htmlFor="circle"
					className="flex w-fit flex-col gap-3 rounded-md border bg-background px-2 py-1 hover:bg-gray-3 [&:has([data-state=checked])]:border-primary"
				>
					<RadioGroupItem value="circle" id="circle" className="sr-only" />
					<h2 className="font-medium">circle</h2>
				</Label>
				<Label
					htmlFor="circle-alt"
					className="flex w-fit flex-col gap-3 rounded-md border bg-background px-2 py-1 hover:bg-gray-3 [&:has([data-state=checked])]:border-primary"
				>
					<RadioGroupItem
						value="circle-alt"
						id="circle-alt"
						className="sr-only"
					/>
					<h2 className="font-medium">circle-alt</h2>
				</Label>
				<Label
					htmlFor="line"
					className="flex w-fit flex-col gap-3 rounded-md border bg-background px-2 py-1 hover:bg-gray-3 [&:has([data-state=checked])]:border-primary"
				>
					<RadioGroupItem value="line" id="line" className="sr-only" />
					<h2 className="font-medium">line</h2>
				</Label>
			</RadioGroup>
      <Stepper variant={variant} initialStep={0} steps={steps}>
        {steps.map((stepProps, index) => {
          return (
            <Step key={stepProps.label} {...stepProps}>
              <div className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md">
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
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper()
  return (
    <>
      {hasCompletedAllSteps && (
        <div className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md">
          <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="w-full flex justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            Reset
          </Button>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary"
            >
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>
          </>
        )}
      </div>
    </>
  )
}
