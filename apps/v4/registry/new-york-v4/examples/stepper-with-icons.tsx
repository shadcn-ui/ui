"use client"

import { FileText, Settings, User } from "lucide-react"

import { Stepper } from "@/registry/new-york-v4/ui/stepper"
import { StepperItem } from "@/registry/new-york-v4/ui/stepper-item"

export default function StepperWithIcons() {
  return (
    <Stepper currentStep={1} className="w-full max-w-lg">
      <StepperItem
        title="Personal Info"
        icon={<User className="size-4" />}
      />
      <StepperItem
        title="Documents"
        icon={<FileText className="size-4" />}
      />
      <StepperItem
        title="Settings"
        icon={<Settings className="size-4" />}
      />
    </Stepper>
  )
}
