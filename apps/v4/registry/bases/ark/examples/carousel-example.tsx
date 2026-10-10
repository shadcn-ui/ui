import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/ark/components/example"
import { Card, CardContent } from "@/registry/bases/ark/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/bases/ark/ui/carousel"

export default function CarouselExample() {
  return (
    <ExampleWrapper className="lg:grid-cols-1">
      <CarouselBasic />
      <CarouselMultiple />
      <CarouselWithGap />
    </ExampleWrapper>
  )
}

function CarouselBasic() {
  return (
    <Example title="Basic">
      <Carousel slideCount={5} className="mx-auto max-w-xs sm:max-w-sm">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} index={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>
    </Example>
  )
}

function CarouselMultiple() {
  return (
    <Example title="Multiple">
      <Carousel
        slideCount={5}
        slidesPerPage={3}
        className="mx-auto max-w-xs sm:max-w-sm"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
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
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>
    </Example>
  )
}

function CarouselWithGap() {
  return (
    <Example title="With Gap">
      <Carousel
        slideCount={5}
        slidesPerPage={2}
        spacing="16px"
        className="mx-auto max-w-xs sm:max-w-sm"
      >
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
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>
    </Example>
  )
}
