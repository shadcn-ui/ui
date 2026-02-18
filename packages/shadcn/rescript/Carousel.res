@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

open BaseUi.Types

type carouselApi
type carouselRef = ReactDOM.domRef
type emblaOptions = {axis: string}

@module("embla-carousel-react")
external useEmblaCarousel: (
  ~options: emblaOptions=?,
  ~plugins: array<JSON.t>=?,
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
let make = (~className="", ~children=?, ~dataOrientation=DataOrientation.Horizontal) => {
  let orientation = dataOrientation
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
    carouselRef,
    api,
    orientation,
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
  })
  let rootProps: BaseUi.Types.props<string, bool> = {
    className: "",
    children: React.null,
    dataSlot: "carousel",
  }
  module Provider = {
    let make = React.Context.provider(context)
  }
  <Provider value={providerValue}>
    <div
      {...rootProps}
      className={`relative ${className}`}
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
    ~onKeyDownCapture=?,
  ) => {
    let {carouselRef, orientation} = useCarousel()
    let outerProps: BaseUi.Types.props<string, bool> = {
      className: "",
      children: React.null,
      dataSlot: "carousel-content",
    }
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      ?children,
    }
    <div {...outerProps} ref={carouselRef} className="overflow-hidden">
      <div
        {...props}
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
    ~onKeyDownCapture=?,
  ) => {
    let {orientation} = useCarousel()
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      ?children,
      dataSlot: "carousel-item",
    }
    <div
      {...props}
      role="group"
      ariaRoledescription="slide"
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
    ~disabled=?,
    ~style: option<ReactDOM.Style.t>=?,
    ~variant=Variant.Outline,
    ~size=Size.IconSm,
    ~nativeButton=?,
    ~type_=?,
    ~ariaLabel=?,
    ~children=?,
    ~onClick=?,
  ) => {
    let {orientation, scrollPrev, canScrollPrev} = useCarousel()
    let disabled = disabled->Option.getOr(!canScrollPrev)
    let style: ReactDOM.Style.t = switch style {
    | Some(style) => {...style, borderColor: "hsl(var(--border))"}
    | None => {borderColor: "hsl(var(--border))"}
    }
    let defaultChildren =
      <>
        <Icons.ChevronLeft className="cn-rtl-flip" />
        <span className="sr-only"> {"Previous slide"->React.string} </span>
      </>
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
      disabled
      style
      onClick={event => {
        onClick->Option.forEach(fn => fn(event))
        scrollPrev()
      }}
    >
      {children->Option.getOr(defaultChildren)}
    </Button>
  }
}

module Next = {
  @react.component
  let make = (
    ~className="",
    ~disabled=?,
    ~style: option<ReactDOM.Style.t>=?,
    ~variant=Variant.Outline,
    ~size=Size.IconSm,
    ~nativeButton=?,
    ~type_=?,
    ~ariaLabel=?,
    ~children=?,
    ~onClick=?,
  ) => {
    let {orientation, scrollNext, canScrollNext} = useCarousel()
    let disabled = disabled->Option.getOr(!canScrollNext)
    let style: ReactDOM.Style.t = switch style {
    | Some(style) => {...style, borderColor: "hsl(var(--border))"}
    | None => {borderColor: "hsl(var(--border))"}
    }
    let defaultChildren =
      <>
        <Icons.ChevronRight className="cn-rtl-flip" />
        <span className="sr-only"> {"Next slide"->React.string} </span>
      </>
    <Button
      className={`absolute touch-manipulation rounded-full ${orientation ==
          DataOrientation.Horizontal
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90"} ${className}`}
      variant
      size
      ?nativeButton
      ?type_
      ?ariaLabel
      dataSlot="carousel-next"
      disabled
      style
      onClick={event => {
        onClick->Option.forEach(fn => fn(event))
        scrollNext()
      }}
    >
      {children->Option.getOr(defaultChildren)}
    </Button>
  }
}
