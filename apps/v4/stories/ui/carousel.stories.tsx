import type { Meta, StoryObj } from "@storybook/react"

import { Card, CardContent } from "@/registry/new-york-v4/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/new-york-v4/ui/carousel"

const meta: Meta<typeof Carousel> = {
  title: "UI/Carousel",
  component: Carousel,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Carousel>

export const Default: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-xs">
      <Carousel>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card>
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
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Carousel orientation="vertical" className="mt-12">
      <CarouselContent className="-mt-4 h-[200px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="pt-4 md:basis-1/2">
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <span className="text-3xl font-semibold">{index + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const MultipleSlidesPerView: Story = {
  name: "Multiple Slides Per View",
  render: () => (
    <Carousel>
      <CarouselContent className="-ml-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/3 pl-2">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-4">
                <span className="text-2xl font-semibold">{index + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const WithLoop: Story = {
  name: "With Loop",
  render: () => (
    <div className="mx-auto w-full max-w-xs">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card>
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
    </div>
  ),
}
