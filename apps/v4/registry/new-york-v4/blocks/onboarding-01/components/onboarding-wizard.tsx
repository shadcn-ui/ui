"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "lucide-react"
import { FormProvider, useForm, type FieldErrors } from "react-hook-form"

import {
  onboardingDefaultValues,
  onboardingSchema,
  steps,
  type OnboardingValues,
} from "@/registry/new-york-v4/blocks/onboarding-01/components/onboarding-schema"
import { OnboardingStepper } from "@/registry/new-york-v4/blocks/onboarding-01/components/onboarding-stepper"
import { StepAccount } from "@/registry/new-york-v4/blocks/onboarding-01/components/step-account"
import { StepPreferences } from "@/registry/new-york-v4/blocks/onboarding-01/components/step-preferences"
import { StepReview } from "@/registry/new-york-v4/blocks/onboarding-01/components/step-review"
import { StepWorkspace } from "@/registry/new-york-v4/blocks/onboarding-01/components/step-workspace"
import { cn } from "@/registry/new-york-v4/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/registry/new-york-v4/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/new-york-v4/ui/empty"
import { Spinner } from "@/registry/new-york-v4/ui/spinner"

export function OnboardingWizard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [furthestStep, setFurthestStep] = React.useState(0)
  const [isComplete, setIsComplete] = React.useState(false)
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const hasRendered = React.useRef(false)

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: onboardingDefaultValues,
    mode: "onBlur",
  })

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isSubmitting = form.formState.isSubmitting

  // Move focus to the new step heading so keyboard and screen reader users
  // land on the fresh content instead of a button that just moved.
  React.useEffect(() => {
    if (!hasRendered.current) {
      hasRendered.current = true
      return
    }

    headingRef.current?.focus()
  }, [currentStep])

  const goToStep = React.useCallback(
    (index: number) => {
      setCurrentStep(Math.min(Math.max(index, 0), steps.length - 1))
    },
    [setCurrentStep]
  )

  async function goToNextStep() {
    // Validate only the fields owned by this step so the user is never blocked
    // by inputs they have not reached yet.
    const isStepValid =
      step.fields.length === 0 ||
      (await form.trigger([...step.fields], { shouldFocus: true }))

    if (!isStepValid) {
      return
    }

    const nextStep = Math.min(currentStep + 1, steps.length - 1)
    setCurrentStep(nextStep)
    setFurthestStep((furthest) => Math.max(furthest, nextStep))
  }

  async function onSubmit(values: OnboardingValues) {
    // Replace with your own submit handler.
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsComplete(true)
  }

  function onInvalid(errors: FieldErrors<OnboardingValues>) {
    // A user can jump back to a completed step and invalidate it, so send them
    // to the first step that actually needs attention.
    const firstInvalidStep = steps.findIndex((candidate) =>
      candidate.fields.some((field) => field in errors)
    )

    if (firstInvalidStep !== -1) {
      setCurrentStep(firstInvalidStep)
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Pressing Enter inside a field should advance the wizard, not submit it
    // from an intermediate step.
    if (!isLastStep) {
      void goToNextStep()
      return
    }

    void form.handleSubmit(onSubmit, onInvalid)(event)
  }

  if (isComplete) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CheckIcon />
                </EmptyMedia>
                <EmptyTitle>You&apos;re all set</EmptyTitle>
                <EmptyDescription>
                  {form.getValues("workspaceName")} is ready. We sent a
                  confirmation to {form.getValues("email")}.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="gap-4">
          <OnboardingStepper
            steps={steps}
            currentStep={currentStep}
            furthestStep={furthestStep}
            onStepSelect={goToStep}
          />
          <div className="flex flex-col gap-1.5">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-lg leading-none font-semibold outline-none"
            >
              {step.title}
            </h2>
            <CardDescription>{step.description}</CardDescription>
          </div>
        </CardHeader>
        <FormProvider {...form}>
          <form onSubmit={handleFormSubmit} noValidate>
            <CardContent>
              {step.id === "account" && <StepAccount />}
              {step.id === "workspace" && <StepWorkspace />}
              {step.id === "preferences" && <StepPreferences />}
              {step.id === "review" && (
                <StepReview values={form.getValues()} onEdit={goToStep} />
              )}
            </CardContent>
            <CardFooter className="mt-6 flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => goToStep(currentStep - 1)}
                disabled={currentStep === 0 || isSubmitting}
                className="w-full sm:w-auto"
              >
                <ArrowLeftIcon />
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Creating workspace
                  </>
                ) : isLastStep ? (
                  "Create workspace"
                ) : (
                  <>
                    Continue
                    <ArrowRightIcon />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
      <p role="status" aria-live="polite" className="sr-only">
        {`Step ${currentStep + 1} of ${steps.length}: ${step.title}`}
      </p>
    </div>
  )
}
