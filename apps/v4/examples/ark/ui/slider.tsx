"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@ark-ui/react/slider"

import { cn } from "@/examples/ark/lib/utils"

// --- Root ---

const Slider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    data-slot="slider"
    className={cn("data-vertical:min-h-40", className)}
    {...props}
  />
))
Slider.displayName = "Slider"

// --- Control ---

const SliderControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SliderPrimitive.Control>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Control
    ref={ref}
    data-slot="slider-control"
    className={cn(className)}
    {...props}
  />
))
SliderControl.displayName = "SliderControl"

// --- Track ---

const SliderTrack = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SliderPrimitive.Track>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Track
    ref={ref}
    data-slot="slider-track"
    className={cn(
      "rounded-full bg-muted data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1",
      className
    )}
    {...props}
  />
))
SliderTrack.displayName = "SliderTrack"

// --- Range ---

const SliderRange = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SliderPrimitive.Range>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Range
    ref={ref}
    data-slot="slider-range"
    className={cn("bg-primary", className)}
    {...props}
  />
))
SliderRange.displayName = "SliderRange"

// --- Thumb ---

const SliderThumb = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SliderPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Thumb
    ref={ref}
    data-slot="slider-thumb"
    className={cn(
      "relative size-3 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3",
      className
    )}
    {...props}
  />
))
SliderThumb.displayName = "SliderThumb"

// --- Label ---

const SliderLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof SliderPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Label
    ref={ref}
    data-slot="slider-label"
    className={cn(className)}
    {...props}
  />
))
SliderLabel.displayName = "SliderLabel"

// --- ValueText ---

const SliderValueText = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof SliderPrimitive.ValueText>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.ValueText
    ref={ref}
    data-slot="slider-value-text"
    className={cn(className)}
    {...props}
  />
))
SliderValueText.displayName = "SliderValueText"

// --- MarkerGroup ---

const SliderMarkerGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SliderPrimitive.MarkerGroup>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.MarkerGroup
    ref={ref}
    data-slot="slider-marker-group"
    className={cn(className)}
    {...props}
  />
))
SliderMarkerGroup.displayName = "SliderMarkerGroup"

// --- Marker ---

const SliderMarker = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof SliderPrimitive.Marker>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Marker
    ref={ref}
    data-slot="slider-marker"
    className={cn(className)}
    {...props}
  />
))
SliderMarker.displayName = "SliderMarker"

// --- HiddenInput ---

const SliderHiddenInput = SliderPrimitive.HiddenInput

// --- Context & RootProvider ---

const SliderContext = SliderPrimitive.Context
const SliderRootProvider = SliderPrimitive.RootProvider

export {
  Slider,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
  SliderLabel,
  SliderValueText,
  SliderMarkerGroup,
  SliderMarker,
  SliderHiddenInput,
  SliderContext,
  SliderRootProvider,
}
export {
  useSlider,
  useSliderContext,
  type SliderValueChangeDetails,
} from "@ark-ui/react/slider"
