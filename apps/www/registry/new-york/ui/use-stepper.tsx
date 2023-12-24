import * as React from "react"

import { useStepperContext } from "./stepper"

type UseStepper = {
  nextStep: () => void
  prevStep: () => void
  resetSteps: () => void
  setStep: (step: number) => void
  activeStep: number
  isDisabledStep: boolean
  isLastStep: boolean
  isOptionalStep: boolean | undefined
}

export function useStepper(): UseStepper {
  const { steps, initialStep } = useStepperContext()

  if (steps.length === 0) {
    throw new Error(
      "useStepper must be used within a StepperProvider. Wrap a parent component in <StepperProvider> to fix this error."
    )
  }

  const [activeStep, setActiveStep] = React.useState(initialStep)

  const nextStep = () => {
    setActiveStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setActiveStep((prev) => prev - 1)
  }

  const resetSteps = () => {
    setActiveStep(initialStep)
  }

  const setStep = (step: number) => {
    setActiveStep(step)
  }

  const isDisabledStep = activeStep === 0

  const isLastStep = activeStep === steps.length - 1

  const isOptionalStep = steps[activeStep]?.optional

  return {
    nextStep,
    prevStep,
    resetSteps,
    setStep,
    activeStep,
    isDisabledStep,
    isLastStep,
    isOptionalStep,
  }
}
