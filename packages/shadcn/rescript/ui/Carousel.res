@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

open BaseUi.Types

type carouselApi
type carouselRef = ReactDOM.domRef

module EmblaOptions = {
  module AxisOptionType = {
    @unboxed
    type t =
      | @as("x") X
      | @as("y") Y
  }
  type t = {
    active?: bool,
    axis?: AxisOptionType.t,
    container?: Dom.element,
    slides?: array<Dom.element>,
    containScroll?: string,
    direction?: string,
    slidesToScroll?: int,
    dragFree?: bool,
    dragThreshold?: float,
    inViewThreshold?: float,
    loop?: bool,
    skipSnaps?: bool,
    duration?: float,
    startIndex?: int,
    watchDrag?: bool,
    watchResize?: bool,
    watchSlides?: bool,
    watchFocus?: bool,
  }
}

type emblaPlugin

@module("embla-carousel-react")
external useEmblaCarousel: (
  ~options: EmblaOptions.t=?,
  ~plugins: array<emblaPlugin>=?,
) => (carouselRef, option<carouselApi>) = "default"

@send external scrollPrevApi: carouselApi => unit = "scrollPrev"
@send external scrollNextApi: carouselApi => unit = "scrollNext"
@send external canScrollPrevApi: carouselApi => bool = "canScrollPrev"
@send external canScrollNextApi: carouselApi => bool = "canScrollNext"
@send external onApi: (carouselApi, string, carouselApi => unit) => unit = "on"
@send external offApi: (carouselApi, string, carouselApi => unit) => unit = "off"

type carouselContext = {
  carouselRef: carouselRef,
  api: option<carouselApi>,
  opts: EmblaOptions.t,
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

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~style=?,
  ~onClick=?,
  ~orientation=DataOrientation.Horizontal,
  ~opts: EmblaOptions.t={},
  ~plugins=?,
  ~setApi=?,
) => {
  let (carouselRef, api) = useEmblaCarousel(
    ~options={
      ...opts,
      axis: switch orientation {
      | Horizontal => X
      | Vertical | Responsive => Y
      },
    },
    ~plugins?,
  )
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
  React.useEffect(() => {
    switch (api, setApi) {
    | (Some(api), Some(setApi)) =>
      setApi(api)
      None
    | _ => None
    }
  }, [api])
  React.useEffect(() => {
    switch (api, setApi) {
    | (Some(api), Some(setApi)) =>
      setApi(api)
      None
    | _ => None
    }
  }, [setApi])
  React.useEffect(() => {
    api->Option.map(api => {
      onSelect(api)
      api->onApi("reInit", onSelect)
      api->onApi("select", onSelect)
      () => api->offApi("select", onSelect)
    })
  }, [api])
  let handleKeyDownCapture = React.useCallback(event => {
    switch event->ReactEvent.Keyboard.key {
    | "ArrowLeft" =>
      event->ReactEvent.Keyboard.preventDefault
      scrollPrev()
    | "ArrowRight" =>
      event->ReactEvent.Keyboard.preventDefault
      scrollNext()
    | _ => ()
    }
  }, [scrollPrev, scrollNext])
  let providerValue = Some({
    carouselRef,
    api,
    opts,
    orientation,
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
  })
  module Provider = {
    let make = React.Context.provider(context)
  }
  <Provider value={providerValue}>
    <div
      ?id
      ?style
      ?onClick
      onKeyDownCapture={handleKeyDownCapture}
      dataSlot="carousel"
      className={className == "" ? "relative" : `relative ${className}`}
      role="region"
      ariaRoledescription="carousel"
      ?children
    />
  </Provider>
}

module Content = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~rootProps: option<BaseUi.Types.DomProps.t>=?,
  ) => {
    let {carouselRef, orientation} = useCarousel()
    let rootProps: BaseUi.Types.DomProps.t = switch rootProps {
    | Some(rootProps) => rootProps
    | None => {}
    }
    <div dataSlot="carousel-content" ref={carouselRef} className="overflow-hidden">
      <div
        {...rootProps}
        ?id
        ?style
        ?onClick
        ?onKeyDown
        ?children
        className={`flex ${orientation == DataOrientation.Horizontal
            ? "-ml-4"
            : "-mt-4 flex-col"} ${className}`}
      />
    </div>
  }
}

module Item = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~rootProps: option<BaseUi.Types.DomProps.t>=?,
  ) => {
    let {orientation} = useCarousel()
    let rootProps: BaseUi.Types.DomProps.t = switch rootProps {
    | Some(rootProps) => rootProps
    | None => {}
    }
    <div
      {...rootProps}
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      role="group"
      ariaRoledescription="slide"
      dataSlot="carousel-item"
      className={`min-w-0 shrink-0 grow-0 basis-full ${orientation == DataOrientation.Horizontal
          ? "pl-4"
          : "pt-4"} ${className}`}
    />
  }
}

module Previous = {
  @react.component
  let make = (
    ~className="",
    ~style=?,
    ~variant=Button.Variant.Outline,
    ~size=Button.Size.IconSm,
    ~nativeButton=?,
    ~type_=?,
    ~ariaLabel=?,
    ~onClick: option<JsxEvent.Mouse.t => unit>=?,
  ) => {
    let {orientation, scrollPrev, canScrollPrev} = useCarousel()
    let resolvedOnClick = switch onClick {
    | Some(handler) => handler
    | None => _ => scrollPrev()
    }
    <Button
      className={`absolute touch-manipulation rounded-full ${orientation ==
          DataOrientation.Horizontal
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90"} ${className}`}
      variant
      size
      ?nativeButton
      ?type_
      ?ariaLabel
      dataSlot="carousel-previous"
      disabled={!canScrollPrev}
      ?style
      onClick={resolvedOnClick}
    >
      <Icons.ChevronLeft className="cn-rtl-flip" />
      <span className="sr-only"> {"Previous slide"->React.string} </span>
    </Button>
  }
}

module Next = {
  @react.component
  let make = (
    ~className="",
    ~style=?,
    ~variant=Button.Variant.Outline,
    ~size=Button.Size.IconSm,
    ~nativeButton=?,
    ~type_=?,
    ~ariaLabel=?,
    ~onClick: option<JsxEvent.Mouse.t => unit>=?,
  ) => {
    let {orientation, scrollNext, canScrollNext} = useCarousel()
    let resolvedOnClick = switch onClick {
    | Some(handler) => handler
    | None => _ => scrollNext()
    }
    <Button
      className={`absolute touch-manipulation rounded-full ${orientation ==
          DataOrientation.Horizontal
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90"} ${className}`}
      variant
      size
      ?style
      ?nativeButton
      ?type_
      ?ariaLabel
      dataSlot="carousel-next"
      disabled={!canScrollNext}
      onClick={resolvedOnClick}
    >
      <Icons.ChevronRight className="cn-rtl-flip" />
      <span className="sr-only"> {"Next slide"->React.string} </span>
    </Button>
  }
}
