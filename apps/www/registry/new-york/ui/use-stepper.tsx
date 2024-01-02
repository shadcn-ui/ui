import * as React from "react"

type UseStepper = {
  steps: {
    label: string | React.ReactNode
    description?: string | React.ReactNode
    optional?: boolean
  }[]
  nextStep: () => void
  prevStep: () => void
  resetSteps: () => void
  setStep: (step: number) => void
  activeStep: number
  isDisabledStep: boolean
  isLastStep: boolean
  isOptionalStep: boolean | undefined
}

export function useStepper() {
  return null
}
