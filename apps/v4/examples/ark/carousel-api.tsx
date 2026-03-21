"use client"

import * as React from "react"
import { Card, CardContent } from "@/examples/ark/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselPageChangeDetails,
} from "@/examples/ark/ui/carousel"

const SLIDE_COUNT = 5

export default function CarouselDApiDemo() {
  const [current, setCurrent] = React.useState(0)

  return (
    <div className="mx-auto max-w-40 sm:max-w-xs">
      <Carousel
        slideCount={SLIDE_COUNT}
        className="w-full max-w-xs"
        onPageChange={(details: CarouselPageChangeDetails) =>
          setCurrent(details.page)
        }
      >
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current + 1} of {SLIDE_COUNT}
      </div>
    </div>
  )
}
