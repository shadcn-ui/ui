"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@ark-ui/react/progress"

import { cn } from "@/examples/ark/lib/utils"

// --- Root ---

const Progress = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ProgressPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    data-slot="progress"
    className={cn("h-1 rounded-full bg-muted", className)}
    {...props}
  />
))
Progress.displayName = "Progress"

// --- Track ---

const ProgressTrack = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ProgressPrimitive.Track>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Track
    ref={ref}
    data-slot="progress-track"
    className={cn("h-1 rounded-full bg-muted", className)}
    {...props}
  />
))
ProgressTrack.displayName = "ProgressTrack"

// --- Range ---

const ProgressRange = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ProgressPrimitive.Range>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Range
    ref={ref}
    data-slot="progress-range"
    className={cn(className)}
    {...props}
  />
))
ProgressRange.displayName = "ProgressRange"

// --- Label ---

const ProgressLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof ProgressPrimitive.Label>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Label
    ref={ref}
    data-slot="progress-label"
    className={cn("text-sm font-medium", className)}
    {...props}
  />
))
ProgressLabel.displayName = "ProgressLabel"

// --- ValueText ---

const ProgressValueText = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof ProgressPrimitive.ValueText>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.ValueText
    ref={ref}
    data-slot="progress-value-text"
    className={cn(className)}
    {...props}
  />
))
ProgressValueText.displayName = "ProgressValueText"

// --- Circle ---

const ProgressCircle = React.forwardRef<
  SVGSVGElement,
  React.ComponentProps<typeof ProgressPrimitive.Circle>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Circle
    ref={ref}
    data-slot="progress-circle"
    className={cn(className)}
    {...props}
  />
))
ProgressCircle.displayName = "ProgressCircle"

// --- CircleTrack ---

const ProgressCircleTrack = React.forwardRef<
  SVGCircleElement,
  React.ComponentProps<typeof ProgressPrimitive.CircleTrack>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.CircleTrack
    ref={ref}
    data-slot="progress-circle-track"
    className={cn(className)}
    {...props}
  />
))
ProgressCircleTrack.displayName = "ProgressCircleTrack"

// --- CircleRange ---

const ProgressCircleRange = React.forwardRef<
  SVGCircleElement,
  React.ComponentProps<typeof ProgressPrimitive.CircleRange>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.CircleRange
    ref={ref}
    data-slot="progress-circle-range"
    className={cn(className)}
    {...props}
  />
))
ProgressCircleRange.displayName = "ProgressCircleRange"

// --- View ---

const ProgressView = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof ProgressPrimitive.View>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.View
    ref={ref}
    data-slot="progress-view"
    className={cn(className)}
    {...props}
  />
))
ProgressView.displayName = "ProgressView"

// --- Context & RootProvider ---

const ProgressContext = ProgressPrimitive.Context
const ProgressRootProvider = ProgressPrimitive.RootProvider

export {
  Progress,
  ProgressTrack,
  ProgressRange,
  ProgressLabel,
  ProgressValueText,
  ProgressCircle,
  ProgressCircleTrack,
  ProgressCircleRange,
  ProgressView,
  ProgressContext,
  ProgressRootProvider,
}
export {
  useProgress,
  useProgressContext,
  type ProgressValueChangeDetails,
} from "@ark-ui/react/progress"
