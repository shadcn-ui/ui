@react.component
let make = () =>
  <Carousel
    opts={align: "start"}
    orientation=BaseUi.Types.DataOrientation.Vertical
    className="w-full max-w-xs"
  >
    <Carousel.Content className="-mt-1 h-[270px]">
      {Array.fromInitializer(~length=5, index =>
        <Carousel.Item key={Int.toString(index)} className="basis-1/2 pt-1">
          <div className="p-1">
            <Card>
              <Card.Content className="flex items-center justify-center p-6">
                <span className="text-3xl font-semibold">
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
