@@directive("'use client'")

type autoplayOptions = {delay: int, stopOnInteraction: bool}

@module("embla-carousel-autoplay")
external autoplay: autoplayOptions => Carousel.emblaPlugin = "default"

@send external stopAutoplay: Carousel.emblaPlugin => unit = "stop"
@send external resetAutoplay: Carousel.emblaPlugin => unit = "reset"

@react.component
let make = () => {
  let plugin = React.useRef(autoplay({delay: 2000, stopOnInteraction: true}))

  <Carousel
    plugins={[plugin.current]}
    className="w-full max-w-[10rem] sm:max-w-xs"
    onMouseEnter={_ => plugin.current->stopAutoplay}
    onMouseLeave={_ => plugin.current->resetAutoplay}
  >
    <Carousel.Content>
      {Array.fromInitializer(~length=5, index =>
        <Carousel.Item key={Int.toString(index)}>
          <div className="p-1">
            <Card>
              <Card.Content className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-semibold">
                  {Int.toString(index + 1)->React.string}
                </span>
              </Card.Content>
            </Card>
          </div>
        </Carousel.Item>
      )->React.array}
    </Carousel.Content>
    <Carousel.Previous />
    <Carousel.Next />
  </Carousel>
}
