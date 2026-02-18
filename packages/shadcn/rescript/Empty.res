@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

open BaseUi.Types

let emptyMediaVariantClass = (~variant: Variant.t) =>
  switch variant {
  | Icon => "bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-4"
  | Default
  | Secondary
  | Destructive
  | Outline
  | Ghost
  | Muted
  | Line
  | Link
  | Image
  | Legend
  | Label => "bg-transparent"
  }

let emptyMediaVariants = (~variant=Variant.Default) => {
  let base = "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0"
  `${base} ${emptyMediaVariantClass(~variant)}`
}

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
  <div
    ?id
    ?children
    ?style
    ?onClick
    ?onKeyDown
    ?onKeyDownCapture
    dataSlot="empty"
    className={`flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance ${className}`}
  />
}

module Header = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="empty-header"
      className={`flex max-w-sm flex-col items-center gap-2 ${className}`}
    />
}

module Media = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~dataVariant=Variant.Default,
  ) => {
    let variant = dataVariant
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="empty-icon"
      dataVariant={variant}
      className={`${emptyMediaVariants(~variant)} ${className}`}
    />
  }
}

module Title = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="empty-title"
      className={`text-sm font-medium tracking-tight ${className}`}
    />
}

module Description = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="empty-description"
      className={`text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4 ${className}`}
    />
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
  ) =>
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="empty-content"
      className={`flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance ${className}`}
    />
}
