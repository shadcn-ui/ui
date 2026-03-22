"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@ark-ui/react/slider"

import { cn } from "@/registry/ark-vega/lib/utils"

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
    className={cn("relative flex items-center h-5 data-[orientation=vertical]:flex-col data-[orientation=vertical]:h-full data-[orientation=vertical]:w-5", className)}
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
    className={cn("bg-muted rounded-full data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5 flex-1 overflow-hidden", className)}
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
    className={cn("bg-primary h-full data-[orientation=vertical]:w-full", className)}
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
    className={cn("border-primary ring-ring/50 size-4 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden", className)}
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
    className={cn("text-sm font-medium leading-none select-none", className)}
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
    className={cn("text-sm font-medium tabular-nums", className)}
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
    className={cn("flex justify-between mt-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:h-full data-[orientation=vertical]:mt-0 data-[orientation=vertical]:ms-2", className)}
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
    className={cn("text-muted-foreground relative text-xs", className)}
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
