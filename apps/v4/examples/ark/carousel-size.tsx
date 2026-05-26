import { Card, CardContent } from "@/examples/ark/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/examples/ark/ui/carousel"

const SLIDE_COUNT = 5
const SLIDES_PER_PAGE = 3

export default function CarouselSize() {
  return (
    <Carousel
      slideCount={SLIDE_COUNT}
      slidesPerPage={SLIDES_PER_PAGE}
      className="w-full max-w-sm"
    >
      <CarouselContent>
        {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
          <CarouselItem key={index} index={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute top-1/2 -left-12 -translate-y-1/2" />
      <CarouselNext className="absolute top-1/2 -right-12 -translate-y-1/2" />
    </Carousel>
  )
}
