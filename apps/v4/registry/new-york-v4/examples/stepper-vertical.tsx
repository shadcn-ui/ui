"use client"

import { Stepper } from "@/registry/new-york-v4/ui/stepper"
import { StepperItem } from "@/registry/new-york-v4/ui/stepper-item"

export default function StepperVertical() {
  return (
    <Stepper currentStep={1} orientation="vertical" className="w-full max-w-sm">
      <StepperItem
        title="Step 1"
        description="This step is completed"
      />
      <StepperItem
        title="Step 2"
        description="This is the current step"
      />
      <StepperItem
        title="Step 3"
        description="This step is upcoming"
      />
    </Stepper>
  )
}
