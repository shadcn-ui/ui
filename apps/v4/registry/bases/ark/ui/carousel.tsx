"use client"

import * as React from "react"
import { Carousel as ArkCarousel, type useCarouselContext } from "@ark-ui/react/carousel"

import { cn } from "@/registry/bases/ark/lib/utils"
import { Button } from "@/registry/bases/ark/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type CarouselApi = ReturnType<typeof useCarouselContext>

type CarouselProps = {
  orientation?: "horizontal" | "vertical"
  opts?: {
    loop?: boolean
    slidesPerPage?: number
    spacing?: string
  }
}

type CarouselContextProps = {
  orientation: "horizontal" | "vertical"
  canScrollPrev: boolean
  canScrollNext: boolean
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  className,
  children,
  ...props
}: React.ComponentProps<typeof ArkCarousel.Root> & CarouselProps) {
  return (
    <ArkCarousel.Root
      orientation={orientation}
      loop={opts?.loop}
      slidesPerPage={opts?.slidesPerPage}
      spacing={opts?.spacing}
      className={cn("relative", className)}
      data-slot="carousel"
      {...props}
    >
      <ArkCarousel.Context>
        {(context) => (
          <CarouselContext.Provider
            value={{
              orientation,
              canScrollPrev: context.canScrollPrev,
              canScrollNext: context.canScrollNext,
            }}
          >
            {children}
          </CarouselContext.Provider>
        )}
      </ArkCarousel.Context>
    </ArkCarousel.Root>
  )
}

function CarouselContent({
  className,
  ...props
}: React.ComponentProps<typeof ArkCarousel.ItemGroup>) {
  const { orientation } = useCarousel()

  return (
    <ArkCarousel.ItemGroup
      data-slot="carousel-content"
      className={cn(
        "flex",
        orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
        className
      )}
      {...props}
    />
  )
}

function CarouselItem({
  className,
  index,
  ...props
}: React.ComponentProps<typeof ArkCarousel.Item> & { index: number }) {
  const { orientation } = useCarousel()

  return (
    <ArkCarousel.Item
      index={index}
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, canScrollPrev } = useCarousel()

  return (
    <ArkCarousel.PrevTrigger asChild>
      <Button
        data-slot="carousel-previous"
        variant={variant}
        size={size}
        className={cn(
          "cn-carousel-previous absolute touch-manipulation",
          orientation === "horizontal"
            ? "top-1/2 -left-12 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        )}
        disabled={!canScrollPrev}
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
  )
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, canScrollNext } = useCarousel()

  return (
    <ArkCarousel.NextTrigger asChild>
      <Button
        data-slot="carousel-next"
        variant={variant}
        size={size}
        className={cn(
          "cn-carousel-next absolute touch-manipulation",
          orientation === "horizontal"
            ? "top-1/2 -right-12 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        )}
        disabled={!canScrollNext}
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
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
}
