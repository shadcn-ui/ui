import { Card, CardContent } from "@/examples/ark/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/examples/ark/ui/carousel"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

const SLIDE_COUNT = 5
const SLIDES_PER_PAGE = 2

export default function CarouselOrientation() {
  return (
    <Carousel
      slideCount={SLIDE_COUNT}
      slidesPerPage={SLIDES_PER_PAGE}
      orientation="vertical"
      className="w-full max-w-xs"
    >
      <CarouselContent className="h-80">
        {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
          <CarouselItem key={index} index={index}>
            <p className="p-1">
              <Card className="flex min-h-full items-center justify-center">
                <CardContent className="flex items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </p>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute -top-12 left-1/2 -translate-x-1/2">
        <ChevronUpIcon className="size-4" />
      </CarouselPrevious>
      <CarouselNext className="absolute -bottom-12 left-1/2 -translate-x-1/2">
        <ChevronDownIcon className="size-4" />
      </CarouselNext>
    </Carousel>
  )
}
