"use client"

import * as React from "react"
import { CheckIcon, PackageIcon, TruckIcon, UserIcon } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Step,
  StepDescription,
  StepIndicator,
  Stepper,
  StepTitle,
} from "@/registry/new-york-v4/ui/stepper"

export default function StepperWithIcons() {
  const [currentStep, setCurrentStep] = React.useState(1)

  const steps = [
    {
      title: "Account",
      description: "Create your account",
      icon: UserIcon,
    },
    {
      title: "Shipping",
      description: "Add shipping details",
      icon: TruckIcon,
    },
    {
      title: "Package",
      description: "Review your order",
      icon: PackageIcon,
    },
    {
      title: "Complete",
      description: "Order confirmed",
      icon: CheckIcon,
    },
  ]

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <Stepper currentStep={currentStep} onStepChange={setCurrentStep}>
        {steps.map((s, index) => {
          const status =
            index < currentStep
              ? "completed"
              : index === currentStep
                ? "active"
                : "pending"
          return (
            <Step key={s.title} step={index}>
              <StepIndicator status={status}>
                {status === "completed" ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <s.icon className="size-4" />
                )}
              </StepIndicator>
              <StepTitle>{s.title}</StepTitle>
              <StepDescription>{s.description}</StepDescription>
            </Step>
          )
        })}
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
