import type { HTMLAttributes, ReactNode } from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface StepsProps extends HTMLAttributes<HTMLDivElement> {
  steps: {
    id: string
    name: string
    description?: string
    icon?: ReactNode
  }[]
  currentStep: number
  completedSteps?: number[]
}

export function Steps({
  steps,
  currentStep,
  completedSteps = [],
  className,
  ...props
}: StepsProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="relative">
        {/* Progress bar */}
        <div className="absolute inset-x-10 top-5 h-1 rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out"
            style={{
              width: `${Math.max(
                0,
                (currentStep / (steps.length - 1)) * 100
              )}%`,
            }}
          />
        </div>

        <ol className="relative z-10 flex justify-between">
          {steps.map((step, index) => {
            const isActive = currentStep === index
            const isCompleted = completedSteps.includes(index)

            return (
              <li key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-all duration-200",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isActive
                      ? "border-2 border-primary bg-background text-primary"
                      : "border-2 border-muted bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isActive || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.name}
                  </span>
                  {step.description && (
                    <p
                      className={cn(
                        "mt-1 max-w-[120px] text-xs",
                        isActive || isCompleted
                          ? "text-muted-foreground"
                          : "text-muted-foreground/60"
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
