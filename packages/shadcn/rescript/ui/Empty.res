@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

module Variant = {
  @unboxed
  type t =
    | @as("default") Default
    | @as("icon") Icon
}

let emptyMediaVariantClass = (~variant: Variant.t) =>
  switch variant {
  | Icon => "bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-4"
  | Default => "bg-transparent"
  }

let emptyMediaVariants = (~variant=Variant.Default) => {
  let base = "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0"
  `${base} ${emptyMediaVariantClass(~variant)}`
}

@react.component
let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
  <div
    ?id
    ?children
    ?style
    ?onClick
    ?onKeyDown
    dataSlot="empty"
    className={`flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance ${className}`}
  />
}

module Header = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="empty-header"
      className={`flex max-w-sm flex-col items-center gap-2 ${className}`}
    />
}

module Media = {
  @react.component
  let make = (
    ~className="",
    ~variant=Variant.Default,
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
  ) => {
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="empty-icon"
      dataVariant={(variant :> string)}
      className={`${emptyMediaVariants(~variant)} ${className}`}
    />
  }
}

module Title = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="empty-title"
      className={`text-sm font-medium tracking-tight ${className}`}
    />
}

module Description = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="empty-description"
      className={`text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4 ${className}`}
    />
}

module Content = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="empty-content"
      className={`flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance ${className}`}
    />
}
