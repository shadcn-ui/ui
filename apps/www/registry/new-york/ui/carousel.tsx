"use client"

import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons"
import { VariantProps, cva } from "class-variance-authority"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  setApi?: (api: CarouselApi) => void
  orientation?: "horizontal" | "vertical"
  dotsPosition?: "top" | "bottom" | "left" | "right"
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  canScrollPrev: boolean
  canScrollNext: boolean
  totalSlides: number
  currentIndex: number
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      opts,
      plugins,
      setApi,
      orientation = "horizontal",
      dotsPosition = "bottom",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [totalSlides, setTotalSlides] = React.useState(0)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
      setCurrentIndex(api.selectedScrollSnap())
      setTotalSlides(api.scrollSnapList().length)
    }, [])

    const scrollTo = React.useCallback(
      (index: number) => {
        api?.scrollTo(index)
      },
      [api]
    )

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    let effectiveDotsPosition = dotsPosition
    if (
      orientation === "horizontal" &&
      (dotsPosition === "left" || dotsPosition === "right")
    ) {
      console.warn(
        `Invalid dotsPosition "${dotsPosition}" for horizontal orientation, defaulting to "bottom".`
      )
      effectiveDotsPosition = "bottom"
    } else if (
      orientation === "vertical" &&
      (dotsPosition === "top" || dotsPosition === "bottom")
    ) {
      console.warn(
        `Invalid dotsPosition "${dotsPosition}" for vertical orientation, defaulting to "left".`
      )
      effectiveDotsPosition = "left"
    }

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          dotsPosition: effectiveDotsPosition,
          scrollPrev,
          scrollNext,
          scrollTo,
          canScrollPrev,
          canScrollNext,
          totalSlides,
          currentIndex,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRightIcon className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

const dotsContainerVariants = cva("absolute flex justify-center", {
  variants: {
    orientation: {
      horizontal: "inset-x-0 flex-row",
      vertical: "inset-y-0 flex-col",
    },
    size: {
      default: "p-4",
      sm: "p-4",
      md: "p-1",
      lg: "p-0",
    },
    position: {
      top: "-top-10",
      right: "-right-10",
      bottom: "-bottom-10",
      left: "-left-10",
    },
    gap: {
      default: "gap-2",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "default",
    position: "bottom",
    gap: "default",
  },
})

const dotsVariants = cva(
  "rounded-full ring-1 ring-muted ring-offset-1 ring-offset-background transition-all duration-300",
  {
    variants: {
      size: {
        default: "size-3",
        sm: "size-3",
        md: "size-4",
        lg: "size-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface CarouselDotsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dotsContainerVariants>,
    VariantProps<typeof dotsVariants> {}

const CarouselDots = React.forwardRef<HTMLDivElement, CarouselDotsProps>(
  ({ className, size, gap, ...props }, ref) => {
    const { orientation, dotsPosition, totalSlides, currentIndex, scrollTo } =
      useCarousel()

    if (totalSlides <= 1) return null

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          dotsContainerVariants({
            orientation,
            size,
            position: dotsPosition,
            gap,
          }),
          className
        )}
        {...props}
      >
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={currentIndex === index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={cn(
              dotsVariants({ size }),
              currentIndex === index ? "bg-card-foreground" : "bg-muted"
            )}
          />
        ))}
      </div>
    )
  }
)
CarouselDots.displayName = "CarouselDots"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
}
