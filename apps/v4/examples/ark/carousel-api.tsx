"use client"

import { Card, CardContent } from "@/examples/ark/ui/card"
import {
  CarouselContent,
  CarouselControl,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselRootProvider,
  useCarouselApi,
} from "@/examples/ark/ui/carousel"

const SLIDE_COUNT = 5

export default function CarouselDApiDemo() {
  const carousel = useCarouselApi({ slideCount: SLIDE_COUNT })

  return (
    <div className="mx-auto max-w-xs">
      <CarouselRootProvider value={carousel} className="w-full max-w-xs">
        <CarouselControl>
          <CarouselPrevious />
          <CarouselContent>
            {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
              <CarouselItem key={index} index={index}>
                <Card className="m-px">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
        </CarouselControl>
      </CarouselRootProvider>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {carousel.page + 1} of {SLIDE_COUNT}
      </div>
    </div>
  )
}
