@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@module("tailwind-merge")
external twMerge: string => string = "twMerge"

module Size = {
  @unboxed
  type t =
    | @as("default") Default
    | @as("sm") Sm
}

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~style=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~dataSize=Size.Default,
) => {
  let size = dataSize
  let resolvedClassName =
    twMerge(
      `ring-foreground/10 bg-card text-card-foreground group/card flex flex-col gap-4 overflow-hidden rounded-xl py-4 text-sm ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl ${className}`,
    )
  <div
    ?id
    ?children
    ?style
    ?onClick
    ?onKeyDown
    dataSlot="card"
    dataSize={(size :> string)}
    className=resolvedClassName
  />
}

module Header = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
    let resolvedClassName =
      twMerge(
        `group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3 ${className}`,
      )
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="card-header"
      className=resolvedClassName
    />
  }
}

module Title = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
    let resolvedClassName =
      twMerge(`text-base leading-snug font-medium group-data-[size=sm]/card:text-sm ${className}`)
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="card-title"
      className=resolvedClassName
    />
  }
}

module Description = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
    let resolvedClassName = twMerge(`text-muted-foreground text-sm ${className}`)
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="card-description"
      className=resolvedClassName
    />
  }
}

module Action = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
    let resolvedClassName =
      twMerge(`col-start-2 row-span-2 row-start-1 self-start justify-self-end ${className}`)
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="card-action"
      className=resolvedClassName
    />
  }
}

module Content = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
    let resolvedClassName = twMerge(`px-4 group-data-[size=sm]/card:px-3 ${className}`)
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="card-content"
      className=resolvedClassName
    />
  }
}

module Footer = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
    let resolvedClassName =
      twMerge(
        `bg-muted/50 flex items-center rounded-b-xl border-t p-4 group-data-[size=sm]/card:p-3 ${className}`,
      )
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="card-footer"
      className=resolvedClassName
    />
  }
}
