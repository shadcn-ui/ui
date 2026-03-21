"use client"

import * as React from "react"
import { Carousel as ArkCarousel } from "@ark-ui/react/carousel"

import { cn } from "@/examples/ark/lib/utils"
import { Button } from "@/examples/ark/ui-rtl/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

const Carousel = React.forwardRef<
  React.ElementRef<typeof ArkCarousel.Root>,
  React.ComponentPropsWithoutRef<typeof ArkCarousel.Root>
>(({ className, ...props }, ref) => (
  <ArkCarousel.Root
    ref={ref}
    data-slot="carousel"
    className={cn("relative", className)}
    {...props}
  />
))
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  React.ElementRef<typeof ArkCarousel.ItemGroup>,
  React.ComponentPropsWithoutRef<typeof ArkCarousel.ItemGroup>
>(({ className, ...props }, ref) => (
  <ArkCarousel.ItemGroup
    ref={ref}
    data-slot="carousel-content"
    className={cn("flex", className)}
    {...props}
  />
))
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  React.ElementRef<typeof ArkCarousel.Item>,
  React.ComponentPropsWithoutRef<typeof ArkCarousel.Item>
>(({ className, ...props }, ref) => (
  <ArkCarousel.Item
    ref={ref}
    data-slot="carousel-item"
    className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon-sm", ...props }, ref) => (
  <ArkCarousel.PrevTrigger asChild>
    <Button
      ref={ref}
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn("absolute touch-manipulation rounded-full", className)}
      {...props}
    >
      <ChevronLeftIcon className="rtl:rotate-180" />
      <span className="sr-only">Previous slide</span>
    </Button>
  </ArkCarousel.PrevTrigger>
))
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon-sm", ...props }, ref) => (
  <ArkCarousel.NextTrigger asChild>
    <Button
      ref={ref}
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn("absolute touch-manipulation rounded-full", className)}
      {...props}
    >
      <ChevronRightIcon className="rtl:rotate-180" />
      <span className="sr-only">Next slide</span>
    </Button>
  </ArkCarousel.NextTrigger>
))
CarouselNext.displayName = "CarouselNext"

const CarouselControl = React.forwardRef<
  React.ElementRef<typeof ArkCarousel.Control>,
  React.ComponentPropsWithoutRef<typeof ArkCarousel.Control>
>(({ className, ...props }, ref) => (
  <ArkCarousel.Control
    ref={ref}
    data-slot="carousel-control"
    className={cn(className)}
    {...props}
  />
))
CarouselControl.displayName = "CarouselControl"

const CarouselIndicatorGroup = React.forwardRef<
  React.ElementRef<typeof ArkCarousel.IndicatorGroup>,
  React.ComponentPropsWithoutRef<typeof ArkCarousel.IndicatorGroup>
>(({ className, ...props }, ref) => (
  <ArkCarousel.IndicatorGroup
    ref={ref}
    data-slot="carousel-indicator-group"
    className={cn(className)}
    {...props}
  />
))
CarouselIndicatorGroup.displayName = "CarouselIndicatorGroup"

const CarouselIndicator = React.forwardRef<
  React.ElementRef<typeof ArkCarousel.Indicator>,
  React.ComponentPropsWithoutRef<typeof ArkCarousel.Indicator>
>(({ className, ...props }, ref) => (
  <ArkCarousel.Indicator
    ref={ref}
    data-slot="carousel-indicator"
    className={cn(className)}
    {...props}
  />
))
CarouselIndicator.displayName = "CarouselIndicator"

function CarouselAutoplayTrigger({
  className,
  ...props
}: React.ComponentProps<typeof ArkCarousel.AutoplayTrigger>) {
  return (
    <ArkCarousel.AutoplayTrigger
      data-slot="carousel-autoplay-trigger"
      className={cn(className)}
      {...props}
    />
  )
}

const CarouselContext = ArkCarousel.Context
const CarouselRootProvider = ArkCarousel.RootProvider

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselControl,
  CarouselIndicatorGroup,
  CarouselIndicator,
  CarouselAutoplayTrigger,
  CarouselContext,
  CarouselRootProvider,
}

export {
  useCarousel as useCarouselApi,
  useCarouselContext,
  type CarouselPageChangeDetails,
} from "@ark-ui/react/carousel"
