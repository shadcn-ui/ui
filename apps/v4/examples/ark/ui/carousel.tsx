"use client"

import * as React from "react"
import { Carousel as ArkCarousel } from "@ark-ui/react/carousel"

import { cn } from "@/examples/ark/lib/utils"
import { Button } from "@/examples/ark/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

const Carousel = React.forwardRef<
  React.ElementRef<typeof ArkCarousel.Root>,
  React.ComponentPropsWithoutRef<typeof ArkCarousel.Root>
>(({ className, spacing = "1rem", loop = false, page, ...props }, ref) => (
  <ArkCarousel.Root
    ref={ref}
    data-slot="carousel"
    spacing={spacing}
    loop={loop}
    page={page}
    className={cn(
      "relative flex w-full flex-col gap-4 data-[orientation=vertical]:flex-row",
      className
    )}
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
    className={cn(
      "flex min-w-0 flex-1 overflow-hidden rounded-lg [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      className
    )}
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

const CarouselControl = React.forwardRef<
  React.ElementRef<typeof ArkCarousel.Control>,
  React.ComponentPropsWithoutRef<typeof ArkCarousel.Control>
>(({ className, ...props }, ref) => (
  <ArkCarousel.Control
    ref={ref}
    data-slot="carousel-control"
    className={cn(
      "flex items-center justify-center gap-2 data-[orientation=vertical]:flex-col",
      className
    )}
    {...props}
  />
))
CarouselControl.displayName = "CarouselControl"

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
      className={cn(
        "touch-manipulation rounded-full disabled:opacity-50",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon className="cn-rtl-flip size-4" />
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
      className={cn(
        "touch-manipulation rounded-full disabled:opacity-50",
        className
      )}
      {...props}
    >
      <ChevronRightIcon className="cn-rtl-flip size-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  </ArkCarousel.NextTrigger>
))
CarouselNext.displayName = "CarouselNext"

const CarouselIndicatorGroup = React.forwardRef<
  React.ElementRef<typeof ArkCarousel.IndicatorGroup>,
  React.ComponentPropsWithoutRef<typeof ArkCarousel.IndicatorGroup>
>(({ className, ...props }, ref) => (
  <ArkCarousel.IndicatorGroup
    ref={ref}
    data-slot="carousel-indicator-group"
    className={cn(
      "flex justify-center gap-2 data-[orientation=vertical]:flex-col",
      className
    )}
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
    className={cn(
      "size-2.5 cursor-pointer rounded-full border-0 bg-muted-foreground/30 p-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-current:bg-primary",
      className
    )}
    {...props}
  />
))
CarouselIndicator.displayName = "CarouselIndicator"

const CarouselIndicators = React.forwardRef<
  React.ElementRef<typeof ArkCarousel.IndicatorGroup>,
  Omit<React.ComponentPropsWithoutRef<typeof ArkCarousel.Indicator>, "index">
>(function CarouselIndicators(props, ref) {
  return (
    <ArkCarousel.Context>
      {(api) => (
        <CarouselIndicatorGroup ref={ref}>
          {api.pageSnapPoints.map((_, index) => (
            <CarouselIndicator key={index} index={index} {...props} />
          ))}
        </CarouselIndicatorGroup>
      )}
    </ArkCarousel.Context>
  )
})
CarouselIndicators.displayName = "CarouselIndicators"

const CarouselAutoplayTrigger = ArkCarousel.AutoplayTrigger
const CarouselContext = ArkCarousel.Context
const CarouselRootProvider = ArkCarousel.RootProvider

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselControl,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicatorGroup,
  CarouselIndicator,
  CarouselIndicators,
  CarouselAutoplayTrigger,
  CarouselContext,
  CarouselRootProvider,
}

export {
  useCarousel as useCarouselApi,
  useCarouselContext,
} from "@ark-ui/react/carousel"
