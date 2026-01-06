"use client"

import * as React from "react"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Step,
  StepDescription,
  Stepper,
  StepTitle,
} from "@/registry/new-york-v4/ui/stepper"

export default function StepperVertical() {
  const [currentStep, setCurrentStep] = React.useState(1)

  const steps = [
    { title: "Create account", description: "Enter your email and password" },
    { title: "Verify email", description: "Check your inbox for verification" },
    { title: "Complete profile", description: "Add your personal information" },
    { title: "Get started", description: "You're all set!" },
  ]

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  return (
    <div className="flex flex-col gap-6">
      <Stepper
        orientation="vertical"
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        className="max-w-xs"
      >
        {steps.map((step, index) => (
          <Step key={step.title} step={index}>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Step>
        ))}
      </Stepper>
      <div className="flex gap-2">
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
