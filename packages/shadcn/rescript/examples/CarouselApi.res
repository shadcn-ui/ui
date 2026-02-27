@@directive("'use client'")

@react.component
let make = () => {
  let (emblaApi, setEmblaApi) = React.useState(() => None)
  let (current, setCurrent) = React.useState(() => 0)
  let (count, setCount) = React.useState(() => 0)

  React.useEffect(() => {
    switch emblaApi {
    | Some(api) =>
      setCount(_ => api->Carousel.scrollSnapListApi->Array.length)
      setCurrent(_ => api->Carousel.selectedScrollSnapApi + 1)
      api->Carousel.onApi("select", _ => setCurrent(_ => api->Carousel.selectedScrollSnapApi + 1))
      None
    | None => None
    }
  }, [emblaApi])

  <div className="mx-auto max-w-[10rem] sm:max-w-xs">
    <Carousel className="w-full max-w-xs" setApi={api => setEmblaApi(_ => Some(api))}>
      <Carousel.Content>
        {Array.fromInitializer(~length=5, index =>
          <Carousel.Item key={Int.toString(index)}>
            <Card className="m-px">
              <Card.Content className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-semibold">
                  {Int.toString(index + 1)->React.string}
                </span>
              </Card.Content>
            </Card>
          </Carousel.Item>
        )->React.array}
      </Carousel.Content>
      <Carousel.Previous />
      <Carousel.Next />
    </Carousel>
    <div className="text-muted-foreground py-2 text-center text-sm">
      {"Slide "->React.string}
      {current->Int.toString->React.string}
      {" of "->React.string}
      {count->Int.toString->React.string}
    </div>
  </div>
}
