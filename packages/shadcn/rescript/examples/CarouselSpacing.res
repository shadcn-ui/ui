@react.component
let make = () =>
  <Carousel className="w-full max-w-[12rem] sm:max-w-xs md:max-w-sm">
    <Carousel.Content className="-ml-1">
      {Array.fromInitializer(~length=5, index =>
        <Carousel.Item key={Int.toString(index)} className="basis-1/2 pl-1 lg:basis-1/3">
          <div className="p-1">
            <Card>
              <Card.Content className="flex aspect-square items-center justify-center p-6">
                <span className="text-2xl font-semibold">
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
