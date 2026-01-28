"use client"

import * as React from "react"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Step,
  StepDescription,
  Stepper,
  StepTitle,
} from "@/registry/new-york-v4/ui/stepper"

export default function StepperColors() {
  const [currentStep, setCurrentStep] = React.useState(1)

  const steps = [
    { title: "Draft", description: "Create your content", color: "#6366f1" },
    { title: "Review", description: "Check for errors", color: "#f59e0b" },
    { title: "Publish", description: "Make it live", color: "#22c55e" },
  ]

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <Stepper currentStep={currentStep} onStepChange={setCurrentStep}>
        {steps.map((step, index) => (
          <Step key={step.title} step={index} color={step.color}>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Step>
        ))}
      </Stepper>
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
          Next
        </Button>
      </div>
    </div>
  )
}
