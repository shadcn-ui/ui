"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Check, Clock, Loader2, X, Circle, AlertCircle, type LucideIcon } from "lucide-react"
import { useEffect, useState } from "react"

export type StepStatus = "pending" | "current" | "in-progress" | "completed" | "error" | "warning"

export interface Step {
  id: string
  title: string
  description?: string
  status: StepStatus
  icon?: LucideIcon
  optional?: boolean
  errorMessage?: string
  warningMessage?: string
}

interface StepProgressProps {
  steps: Step[]
  currentStep?: number
  orientation?: "vertical" | "horizontal" | "responsive"
  showConnector?: boolean
  showProgress?: boolean
  clickableSteps?: boolean
  compact?: boolean | "responsive"
  className?: string
  onStepClick?: (stepIndex: number) => void
}

const statusConfig = {
  pending: {
    icon: Circle,
    badge: "Pending",
    badgeVariant: "secondary" as const,
    iconColor: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-muted",
  },
  current: {
    icon: Clock,
    badge: "Current",
    badgeVariant: "default" as const,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary",
  },
  "in-progress": {
    icon: Loader2,
    badge: "In Progress",
    badgeVariant: "default" as const,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary",
    animate: true,
  },
  completed: {
    icon: Check,
    badge: "Completed",
    badgeVariant: "default" as const,
    iconColor: "text-primary-foreground",
    bgColor: "bg-primary",
    borderColor: "border-primary",
  },
  error: {
    icon: X,
    badge: "Error",
    badgeVariant: "destructive" as const,
    iconColor: "text-destructive-foreground",
    bgColor: "bg-destructive",
    borderColor: "border-destructive",
  },
  warning: {
    icon: AlertCircle,
    badge: "Warning",
    badgeVariant: "outline" as const,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
}

export function StepProgress({
  steps,
  currentStep,
  orientation = "responsive",
  showConnector = true,
  showProgress = false,
  clickableSteps = false,
  compact = "responsive",
  className,
  onStepClick,
}: StepProgressProps) {
  const [progress, setProgress] = useState(0)

  // Determine if we should use horizontal layout based on screen size and orientation
  const getOrientation = () => {
    if (orientation === "responsive") {
      // Use horizontal on larger screens, vertical on mobile
      return "lg:horizontal"
    }
    return orientation
  }

  // Determine if we should use compact mode
  const getCompactMode = () => {
    if (compact === "responsive") {
      return true // Will be handled by responsive classes
    }
    return compact
  }

  const isResponsive = orientation === "responsive"
  const isCompactResponsive = compact === "responsive"

  // Calculate progress percentage
  useEffect(() => {
    const completedSteps = steps.filter((step) => step.status === "completed").length
    const progressPercentage = (completedSteps / steps.length) * 100
    setProgress(progressPercentage)
  }, [steps])

  const handleStepClick = (index: number, step: Step) => {
    if (clickableSteps && onStepClick && (step.status === "completed" || step.status === "current")) {
      onStepClick(index)
    }
  }

  const StepIcon = ({ step, config }: { step: Step; config: any }) => {
    const IconComponent = step.icon || config.icon
    return (
      <IconComponent
        className={cn(
          "transition-all duration-200",
          // Responsive icon sizes
          "w-3 h-3 sm:w-4 sm:h-4",
          isCompactResponsive && "lg:w-4 lg:h-4",
          config.iconColor,
          config.animate && "animate-spin",
        )}
      />
    )
  }

  const StepContent = ({
    step,
    index,
    config,
    isLast,
  }: {
    step: Step
    index: number
    config: any
    isLast: boolean
  }) => {
    const isClickable = clickableSteps && (step.status === "completed" || step.status === "current")
    const isCurrent = currentStep === index

    const content = (
      <Card
        className={cn(
          "transition-all duration-200",
          // Responsive layout
          "w-full",
          isResponsive && "lg:w-full",
          // Current step highlighting
          isCurrent && "ring-2 ring-primary/20",
          step.status === "error" && "ring-2 ring-destructive/20",
          step.status === "warning" && "ring-2 ring-yellow-200 dark:ring-yellow-800",
          // Clickable states
          isClickable && "cursor-pointer hover:shadow-md active:scale-[0.98]",
          // Responsive compact mode
          isCompactResponsive && "shadow-sm sm:shadow-md border-0 sm:border",
          getCompactMode() === true && "shadow-none border-0",
        )}
        onClick={() => handleStepClick(index, step)}
      >
        <CardContent
          className={cn(
            "transition-all duration-200",
            // Responsive padding
            "p-3 sm:p-4",
            isCompactResponsive && "lg:p-4",
            getCompactMode() === true && "p-3",
          )}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <h3
                className={cn(
                  "font-medium transition-colors duration-200",
                  // Responsive text sizes
                  "text-xs sm:text-sm",
                  isCompactResponsive && "lg:text-sm",
                  getCompactMode() === true && "text-xs",
                  // Status colors
                  step.status === "completed" && "text-primary",
                  step.status === "error" && "text-destructive",
                  step.status === "warning" && "text-yellow-700 dark:text-yellow-300",
                  // Text truncation for mobile
                  "truncate sm:text-clip",
                )}
              >
                {step.title}
              </h3>
              {step.optional && (
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 transition-all duration-200",
                    // Responsive badge sizes
                    "text-[10px] px-1 sm:text-xs sm:px-2",
                    isCompactResponsive && "lg:text-xs lg:px-2",
                  )}
                >
                  Optional
                </Badge>
              )}
            </div>
            <Badge
              variant={config.badgeVariant}
              className={cn(
                "shrink-0 transition-all duration-200",
                // Responsive badge sizes
                "text-[10px] px-1 sm:text-xs sm:px-2",
                isCompactResponsive && "lg:text-xs lg:px-2",
                getCompactMode() === true && "text-[10px] px-1",
              )}
            >
              {config.badge}
            </Badge>
          </div>

          {/* Description - hidden on mobile in compact mode, shown on larger screens */}
          {step.description && (
            <p
              className={cn(
                "text-muted-foreground leading-relaxed mb-2 transition-all duration-200",
                // Responsive text and visibility
                "text-xs",
                isCompactResponsive && "hidden sm:block lg:text-xs",
                getCompactMode() === true && "hidden",
              )}
            >
              {step.description}
            </p>
          )}

          {/* Error/Warning Messages */}
          {step.errorMessage && step.status === "error" && (
            <p className={cn("mt-1 transition-all duration-200", "text-[10px] sm:text-xs text-destructive")}>
              {step.errorMessage}
            </p>
          )}
          {step.warningMessage && step.status === "warning" && (
            <p
              className={cn(
                "mt-1 transition-all duration-200",
                "text-[10px] sm:text-xs text-yellow-700 dark:text-yellow-300",
              )}
            >
              {step.warningMessage}
            </p>
          )}
        </CardContent>
      </Card>
    )

    // Show tooltip on mobile for compact descriptions
    if (step.description && (isCompactResponsive || getCompactMode() === true)) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs">{step.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return content
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar */}
      {showProgress && (
        <div className={cn("mb-4 sm:mb-6 transition-all duration-200", isResponsive && "lg:mb-6")}>
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress
            value={progress}
            className={cn("transition-all duration-200", "h-1.5 sm:h-2", isResponsive && "lg:h-2")}
          />
        </div>
      )}

      {/* Steps Container */}
      <div
        className={cn(
          "flex transition-all duration-200",
          // Responsive layout switching
          isResponsive
            ? [
                // Mobile: vertical layout
                "flex-col gap-2 sm:gap-3",
                // Desktop: horizontal layout
                "lg:flex-row lg:gap-4 lg:overflow-x-auto lg:pb-2",
              ]
            : [
                // Fixed orientations
                orientation === "horizontal"
                  ? "flex-row gap-2 sm:gap-4 overflow-x-auto pb-2"
                  : "flex-col gap-2 sm:gap-3",
              ],
        )}
      >
        {steps.map((step, index) => {
          const config = statusConfig[step.status]
          const isLast = index === steps.length - 1
          const isCurrent = currentStep === index

          return (
            <div
              key={step.id}
              className={cn(
                "flex transition-all duration-200",
                // Responsive step layout
                isResponsive
                  ? [
                      // Mobile: horizontal step layout
                      "flex-row gap-3 sm:gap-4",
                      // Desktop: vertical step layout when horizontal overall
                      "lg:flex-col lg:items-center lg:min-w-0 lg:flex-1",
                    ]
                  : [
                      // Fixed orientations
                      orientation === "horizontal" ? "flex-col items-center min-w-0 flex-1" : "flex-row gap-3 sm:gap-4",
                    ],
              )}
            >
              {/* Step Icon and Connector */}
              <div
                className={cn(
                  "flex items-center transition-all duration-200",
                  isResponsive
                    ? ["flex-col items-center", "lg:flex-col"]
                    : [orientation === "horizontal" ? "flex-col" : "flex-col items-center"],
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 transition-all duration-200",
                    // Responsive icon container sizes
                    "w-8 h-8 sm:w-10 sm:h-10",
                    isCompactResponsive && "lg:w-10 lg:h-10",
                    getCompactMode() === true && "w-8 h-8",
                    // Status styling
                    config.bgColor,
                    config.borderColor,
                    // Current step ring
                    isCurrent && "ring-2 ring-primary/20 ring-offset-1 sm:ring-offset-2",
                    // Touch targets for mobile
                    clickableSteps && "active:scale-95",
                  )}
                >
                  <StepIcon step={step} config={config} />
                </div>

                {/* Connector Lines */}
                {showConnector && !isLast && (
                  <div
                    className={cn(
                      "bg-border transition-all duration-200",
                      isResponsive
                        ? [
                            // Mobile: vertical connector
                            "w-px h-6 sm:h-8 mt-2",
                            // Desktop: horizontal connector (handled separately)
                            "lg:hidden",
                          ]
                        : [
                            // Fixed orientations
                            orientation === "horizontal" ? "hidden" : "w-px h-6 sm:h-8 mt-2",
                          ],
                    )}
                  />
                )}
              </div>

              {/* Horizontal Connector for Desktop */}
              {showConnector && !isLast && isResponsive && (
                <div className={cn("hidden lg:flex lg:flex-1 lg:h-px lg:bg-border lg:mt-4 xl:mt-5")} />
              )}
              {showConnector && !isLast && orientation === "horizontal" && (
                <div className={cn("flex-1 h-px bg-border mt-4 sm:mt-5")} />
              )}

              {/* Step Content */}
              <div
                className={cn(
                  "transition-all duration-200",
                  isResponsive
                    ? ["flex-1", "lg:w-full lg:mt-4"]
                    : [orientation === "horizontal" ? "w-full mt-4" : "flex-1"],
                )}
              >
                <StepContent step={step} index={index} config={config} isLast={isLast} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
