"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent, CardFooter } from "@/registry/bases/base/ui/card"
import {
  Step,
  StepDescription,
  Stepper,
  StepTitle,
} from "@/registry/bases/base/ui/stepper"

export default function StepperExample() {
  return (
    <ExampleWrapper>
      <StepperBasic />
      <StepperVertical />
      <StepperColors />
      <StepperInCard />
    </ExampleWrapper>
  )
}

function StepperBasic() {
  const [currentStep, setCurrentStep] = React.useState(1)

  return (
    <Example title="Basic">
      <div className="flex w-full flex-col gap-6">
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
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            size="sm"
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 2))}
            disabled={currentStep === 2}
          >
            Next
          </Button>
        </div>
      </div>
    </Example>
  )
}

function StepperVertical() {
  const [currentStep, setCurrentStep] = React.useState(1)

  return (
    <Example title="Vertical">
      <div className="flex w-full flex-col gap-6">
        <Stepper
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          orientation="vertical"
        >
          <Step step={0}>
            <StepTitle>Order Placed</StepTitle>
            <StepDescription>Your order has been confirmed</StepDescription>
          </Step>
          <Step step={1}>
            <StepTitle>Processing</StepTitle>
            <StepDescription>We&apos;re preparing your order</StepDescription>
          </Step>
          <Step step={2}>
            <StepTitle>Shipped</StepTitle>
            <StepDescription>Your order is on its way</StepDescription>
          </Step>
          <Step step={3}>
            <StepTitle>Delivered</StepTitle>
            <StepDescription>Order has been delivered</StepDescription>
          </Step>
        </Stepper>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            size="sm"
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 3))}
            disabled={currentStep === 3}
          >
            Next
          </Button>
        </div>
      </div>
    </Example>
  )
}

function StepperColors() {
  const [currentStep, setCurrentStep] = React.useState(1)

  const steps = [
    { title: "Draft", description: "Create your content", color: "#6366f1" },
    { title: "Review", description: "Check for errors", color: "#f59e0b" },
    { title: "Publish", description: "Make it live", color: "#22c55e" },
  ]

  return (
    <Example title="Custom Colors">
      <div className="flex w-full flex-col gap-6">
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
            size="sm"
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            size="sm"
            onClick={() =>
              setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
            }
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </Example>
  )
}

function StepperInCard() {
  const [currentStep, setCurrentStep] = React.useState(0)

  return (
    <Example title="In Card" containerClassName="lg:col-span-full">
      <Card className="w-full max-w-xl">
        <CardContent className="pt-6">
          <Stepper currentStep={currentStep} onStepChange={setCurrentStep}>
            <Step step={0}>
              <StepTitle>Details</StepTitle>
            </Step>
            <Step step={1}>
              <StepTitle>Payment</StepTitle>
            </Step>
            <Step step={2}>
              <StepTitle>Confirm</StepTitle>
            </Step>
          </Stepper>
          <div className="mt-8 flex min-h-[100px] items-center justify-center rounded-lg border border-dashed p-4">
            <p className="text-muted-foreground text-sm">
              Step {currentStep + 1} content goes here
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 2))}
            disabled={currentStep === 2}
          >
            {currentStep === 2 ? "Finish" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </Example>
  )
}
