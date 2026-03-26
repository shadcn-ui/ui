import { Card, CardContent } from "@/examples/ark/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselControl,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/examples/ark/ui/carousel"

export default function CarouselSize() {
  return (
    <Carousel slideCount={5} slidesPerPage={2} className="w-full max-w-sm">
      <CarouselControl>
        <CarouselPrevious />
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              index={index}
              className={index % 2 === 0 ? "basis-1/3" : "basis-2/3"}
            >
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
        <CarouselNext />
      </CarouselControl>
    </Carousel>
  )
}
