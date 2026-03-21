"use client"

import * as React from "react"
import { Carousel as ArkCarousel } from "@ark-ui/react/carousel"

import { cn } from "@/registry/bases/ark/lib/utils"
import { Button } from "@/registry/bases/ark/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

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
      className={cn(
        "cn-carousel-previous absolute touch-manipulation",
        className
      )}
      {...props}
    >
      <IconPlaceholder
        lucide="ChevronLeftIcon"
        tabler="IconChevronLeft"
        hugeicons="ArrowLeft01Icon"
        phosphor="CaretLeftIcon"
        remixicon="RiArrowLeftSLine"
        className="cn-rtl-flip"
      />
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
        "cn-carousel-next absolute touch-manipulation",
        className
      )}
      {...props}
    >
      <IconPlaceholder
        lucide="ChevronRightIcon"
        tabler="IconChevronRight"
        hugeicons="ArrowRight01Icon"
        phosphor="CaretRightIcon"
        remixicon="RiArrowRightSLine"
        className="cn-rtl-flip"
      />
      <span className="sr-only">Next slide</span>
    </Button>
  </ArkCarousel.NextTrigger>
))
CarouselNext.displayName = "CarouselNext"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}

export {
  useCarousel as useCarouselApi,
  useCarouselContext,
  type CarouselPageChangeDetails,
} from "@ark-ui/react/carousel"
