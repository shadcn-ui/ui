import { Card, CardContent } from "@/examples/ark/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselControl,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/examples/ark/ui/carousel"

export default function CarouselSpacing() {
  return (
    <Carousel
      slideCount={5}
      spacing="16px"
      slidesPerPage={2}
      className="w-full max-w-sm"
    >
      <CarouselControl>
        <CarouselPrevious />
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} index={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-2xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </CarouselControl>
    </Carousel>
  )
}
