import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Card, CardContent } from "@/examples/ark/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselControl,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/examples/ark/ui/carousel"

export default function CarouselOrientation() {
  return (
    <Carousel
      slideCount={5}
      orientation="vertical"
      className="w-full max-w-xs"
    >
      <CarouselContent className="h-80">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} index={index}>
            <Card className="min-h-full flex justify-center items-center">
              <CardContent className="flex items-center justify-center p-6">
                <span className="text-3xl font-semibold">{index + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselControl className="justify-between">
        <CarouselPrevious><ChevronUpIcon className="size-4" /></CarouselPrevious>
        <CarouselIndicatorGroup>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselIndicator key={index} index={index} />
          ))}
        </CarouselIndicatorGroup>
        <CarouselNext><ChevronDownIcon className="size-4" /></CarouselNext>
      </CarouselControl>
    </Carousel>
  )
}
