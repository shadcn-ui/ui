import * as React from "react"

import { StepProps } from "./stepper"

type UseSteps = {
  initialStep: number
  steps: Pick<
    StepProps,
    "label" | "description" | "optional" | "optionalLabel" | "icon"
  >[]
}

type UseStepsReturn = {
  nextStep: () => void
  prevStep: () => void
  resetSteps: () => void
  setStep: (step: number) => void
  activeStep: number
  isDisabledStep: boolean
  isLastStep: boolean
  isOptionalStep: boolean | undefined
}

export function useSteps({ initialStep, steps }: UseSteps): UseStepsReturn {
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

interface UseMediaQueryOptions {
  getInitialValueInEffect: boolean
}

type MediaQueryCallback = (event: { matches: boolean; media: string }) => void

/**
 * Older versions of Safari (shipped withCatalina and before) do not support addEventListener on matchMedia
 * https://stackoverflow.com/questions/56466261/matchmedia-addlistener-marked-as-deprecated-addeventlistener-equivalent
 * */
function attachMediaListener(
  query: MediaQueryList,
  callback: MediaQueryCallback
) {
  try {
    query.addEventListener("change", callback)
    return () => query.removeEventListener("change", callback)
  } catch (e) {
    query.addListener(callback)
    return () => query.removeListener(callback)
  }
}

function getInitialValue(query: string, initialValue?: boolean) {
  if (typeof initialValue === "boolean") {
    return initialValue
  }

  if (typeof window !== "undefined" && "matchMedia" in window) {
    return window.matchMedia(query).matches
  }

  return false
}

export function useMediaQuery(
  query: string,
  initialValue?: boolean,
  { getInitialValueInEffect }: UseMediaQueryOptions = {
    getInitialValueInEffect: true,
  }
) {
  const [matches, setMatches] = React.useState(
    getInitialValueInEffect ? false : getInitialValue(query, initialValue)
  )
  const queryRef = React.useRef<MediaQueryList>()

  React.useEffect(() => {
    if ("matchMedia" in window) {
      queryRef.current = window.matchMedia(query)
      setMatches(queryRef.current.matches)
      return attachMediaListener(queryRef.current, (event) =>
        setMatches(event.matches)
      )
    }

    return undefined
  }, [query])

  return matches
}
