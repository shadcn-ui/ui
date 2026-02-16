open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

type carouselApi
type carouselRef = Nullable.t<Dom.htmlElement> => unit
type emblaOptions = {axis: string}

@module("embla-carousel-react")
external useEmblaCarousel: (~options: emblaOptions=?, ~plugins: array<JSON.t>=?) => (
  carouselRef,
  option<carouselApi>,
) = "default"

external toCallbackRef: carouselRef => ReactDOM.Ref.callbackDomRef = "%identity"
external toJsxDomRef: ReactDOM.Ref.callbackDomRef => JsxDOM.domRef = "%identity"

@send external scrollPrevApi: carouselApi => unit = "scrollPrev"
@send external scrollNextApi: carouselApi => unit = "scrollNext"
@send external canScrollPrevApi: carouselApi => bool = "canScrollPrev"
@send external canScrollNextApi: carouselApi => bool = "canScrollNext"
@send external onApi: (carouselApi, string, carouselApi => unit) => unit = "on"
@send external offApi: (carouselApi, string, carouselApi => unit) => unit = "off"

type carouselContext = {
  carouselRef: carouselRef,
  api: option<carouselApi>,
  orientation: DataOrientation.t,
  scrollPrev: unit => unit,
  scrollNext: unit => unit,
  canScrollPrev: bool,
  canScrollNext: bool,
}

let context: React.Context.t<option<carouselContext>> = React.createContext(None)

let useCarousel = () =>
  switch React.useContext(context) {
  | Some(context) => context
  | None => JsError.throwWithMessage("useCarousel must be used within a <Carousel />")
  }

@react.componentWithProps
let make = (props: propsWithChildren<string, bool>) => {
  let orientation = props.dataOrientation->Option.getOr(DataOrientation.Horizontal)
  let axis = orientation == DataOrientation.Horizontal ? "x" : "y"
  let (carouselRef, api) = useEmblaCarousel(~options={axis: axis})
  let (canScrollPrev, setCanScrollPrev) = React.useState(() => false)
  let (canScrollNext, setCanScrollNext) = React.useState(() => false)
  let onSelect = (api: carouselApi) => {
    setCanScrollPrev(_ => api->canScrollPrevApi)
    setCanScrollNext(_ => api->canScrollNextApi)
  }
  let scrollPrev = () =>
    switch api {
    | Some(api) => api->scrollPrevApi
    | None => ()
    }
  let scrollNext = () =>
    switch api {
    | Some(api) => api->scrollNextApi
    | None => ()
    }
  React.useEffect1(() => {
    switch api {
    | Some(api) =>
      onSelect(api)
      api->onApi("reInit", onSelect)
      api->onApi("select", onSelect)
      Some(() => api->offApi("select", onSelect))
    | None => None
    }
  }, [api])
  let providerValue = Some({
    carouselRef: carouselRef,
    api: api,
    orientation: orientation,
    scrollPrev: scrollPrev,
    scrollNext: scrollNext,
    canScrollPrev: canScrollPrev,
    canScrollNext: canScrollNext,
  })
  let rootProps: propsWithOptionalChildren<string, bool> = {
    className: "",
    children: React.null,
    dataSlot: "carousel",
  }
  module Provider = {
    let make = React.Context.provider(context)
  }
  <Provider value={providerValue}>
    <div
      {...toDomProps(rootProps)}
      className={`relative ${props.className->Option.getOr("")}`}
      role="region"
      ariaLabel="carousel"
    >
      {props.children}
    </div>
  </Provider>
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithOptionalChildren<string, bool>) => {
    let {carouselRef, orientation} = useCarousel()
    let outerProps: propsWithOptionalChildren<string, bool> = {
      className: "",
      children: React.null,
      dataSlot: "carousel-content",
    }
    <div
      {...toDomProps(outerProps)}
      ref={carouselRef->toCallbackRef->toJsxDomRef}
      className="overflow-hidden"
    >
      <div
        {...toDomProps(props)}
        className={`flex ${orientation == DataOrientation.Horizontal ? "-ml-4" : "-mt-4 flex-col"} ${props.className->Option.getOr("")}`}
      />
    </div>
  }
}

module Item = {
  @react.componentWithProps
  let make = (props: propsWithOptionalChildren<string, bool>) => {
    let {orientation} = useCarousel()
    let props = {...props, dataSlot: "carousel-item"}
    <div
      {...toDomProps(props)}
      role="group"
      ariaLabel="slide"
      className={`min-w-0 shrink-0 grow-0 basis-full ${orientation == DataOrientation.Horizontal ? "pl-4" : "pt-4"} ${props.className->Option.getOr("")}`}
    />
  }
}

module Previous = {
  @react.componentWithProps
  let make = (props: propsWithOptionalChildren<string, bool>) => {
    let {orientation, scrollPrev, canScrollPrev} = useCarousel()
    <Button
      {...props}
      dataSlot="carousel-previous"
      dataVariant={props.dataVariant->Option.getOr(Variant.Outline)}
      dataSize={props.dataSize->Option.getOr(Size.IconSm)}
      className={`absolute touch-manipulation rounded-full ${orientation == DataOrientation.Horizontal ? "top-1/2 -left-12 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90"} ${props.className->Option.getOr("")}`}
      disabled={!canScrollPrev}
      onClick={_ => scrollPrev()}
    >
      <Icons.chevronLeft className="cn-rtl-flip" />
      <span className="sr-only">{"Previous slide"->React.string}</span>
    </Button>
  }
}

module Next = {
  @react.componentWithProps
  let make = (props: propsWithOptionalChildren<string, bool>) => {
    let {orientation, scrollNext, canScrollNext} = useCarousel()
    <Button
      {...props}
      dataSlot="carousel-next"
      dataVariant={props.dataVariant->Option.getOr(Variant.Outline)}
      dataSize={props.dataSize->Option.getOr(Size.IconSm)}
      className={`absolute touch-manipulation rounded-full ${orientation == DataOrientation.Horizontal ? "top-1/2 -right-12 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90"} ${props.className->Option.getOr("")}`}
      disabled={!canScrollNext}
      onClick={_ => scrollNext()}
    >
      <Icons.chevronRight className="cn-rtl-flip" />
      <span className="sr-only">{"Next slide"->React.string}</span>
    </Button>
  }
}
