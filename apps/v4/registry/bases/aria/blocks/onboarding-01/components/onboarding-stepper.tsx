"use client"

import { CheckIcon } from "lucide-react"

import { type OnboardingStep } from "@/registry/bases/aria/blocks/onboarding-01/components/onboarding-schema"
import { cn } from "@/registry/bases/aria/lib/utils"
import { Progress } from "@/registry/bases/aria/ui/progress"

export function OnboardingStepper({
  steps,
  currentStep,
  furthestStep,
  onStepSelect,
  className,
  ...props
}: Omit<React.ComponentProps<"nav">, "onSelect"> & {
  steps: ReadonlyArray<OnboardingStep>
  currentStep: number
  furthestStep: number
  onStepSelect: (index: number) => void
}) {
  const total = steps.length
  const active = steps[currentStep]

  return (
    <nav
      aria-label="Onboarding progress"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {/* Compact indicator: the only variant shown on small screens. */}
      <div className="flex flex-col gap-2 sm:hidden">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-medium">{active.title}</p>
          <p className="text-sm text-muted-foreground tabular-nums">
            {currentStep + 1} of {total}
          </p>
        </div>
        <Progress
          value={((currentStep + 1) / total) * 100}
          aria-label={`Step ${currentStep + 1} of ${total}`}
        />
      </div>

      <ol className="hidden items-center gap-2 sm:flex" role="list">
        {steps.map((step, index) => {
          const isComplete = index < furthestStep
          const isCurrent = index === currentStep
          // Only steps already reached may be revisited, so the wizard never
          // skips validation on the way forward.
          const isNavigable = index <= furthestStep && !isCurrent

          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                disabled={!isNavigable}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Step ${index + 1} of ${total}: ${step.title}`}
                onClick={() => onStepSelect(index)}
                className={cn(
                  "group flex flex-1 items-center gap-2.5 rounded-md px-2 py-1.5 text-left",
                  "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  isNavigable && "hover:bg-accent",
                  !isNavigable && "cursor-default"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                    isCurrent &&
                      "border-primary bg-primary text-primary-foreground",
                    isComplete &&
                      !isCurrent &&
                      "border-primary bg-primary/10 text-primary",
                    !isCurrent &&
                      !isComplete &&
                      "border-border text-muted-foreground"
                  )}
                >
                  {isComplete && !isCurrent ? (
                    <CheckIcon className="size-3.5" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "truncate text-sm font-medium transition-colors",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </button>
              {index < total - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px flex-1 bg-border transition-colors",
                    isComplete && "bg-primary/30"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
