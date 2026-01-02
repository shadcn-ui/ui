"use client"

import * as React from "react"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Step,
  StepDescription,
  Stepper,
  StepTitle,
} from "@/registry/new-york-v4/ui/stepper"

export default function StepperDemo() {
  const [currentStep, setCurrentStep] = React.useState(1)

  return (
    <div className="w-full max-w-2xl space-y-8">
      <Stepper currentStep={currentStep} onStepChange={setCurrentStep}>
        <Step step={0}>
          <StepTitle>Account</StepTitle>
          <StepDescription>Create your account</StepDescription>
        </Step>
        <Step step={1}>
          <StepTitle>Profile</StepTitle>
          <StepDescription>Set up your profile</StepDescription>
        </Step>
        <Step step={2}>
          <StepTitle>Complete</StepTitle>
          <StepDescription>Review and finish</StepDescription>
        </Step>
      </Stepper>
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(2, currentStep + 1))}
          disabled={currentStep === 2}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
