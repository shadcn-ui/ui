"use client"

import { Stepper } from "@/registry/new-york-v4/ui/stepper"
import { StepperItem } from "@/registry/new-york-v4/ui/stepper-item"

export default function StepperDemo() {
  return (
    <div className="w-full max-w-xl space-y-8">
      <Stepper currentStep={1}>
        <StepperItem title="Account" description="Create your account" />
        <StepperItem title="Profile" description="Complete your profile" />
        <StepperItem title="Review" description="Verify your details" />
      </Stepper>
    </div>
  )
}
