@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

@react.component
let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
  <div
    ?id
    ?style
    ?onClick
    ?onKeyDown
    dataSlot="table-container"
    className="relative w-full overflow-x-auto"
  >
    <table
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="table"
      className={`w-full caption-bottom text-sm ${className}`}
    />
  </div>
}

module Header = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <thead
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="table-header"
      className={`[&_tr]:border-b ${className}`}
    />
}

module Body = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <tbody
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="table-body"
      className={`[&_tr:last-child]:border-0 ${className}`}
    />
}

module Footer = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <tfoot
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="table-footer"
      className={`bg-muted/50 border-t font-medium [&>tr]:last:border-b-0 ${className}`}
    />
}

module Row = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~dataState=?,
  ) =>
    <tr
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      ?dataState
      dataSlot="table-row"
      className={`hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors ${className}`}
    />
}

module Head = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~colSpan=?, ~onClick=?, ~onKeyDown=?) =>
    <th
      ?id
      ?children
      ?style
      ?colSpan
      ?onClick
      ?onKeyDown
      dataSlot="table-head"
      className={`text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 ${className}`}
    />
}

module Cell = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~colSpan=?, ~onClick=?, ~onKeyDown=?) =>
    <td
      ?id
      ?children
      ?style
      ?colSpan
      ?onClick
      ?onKeyDown
      dataSlot="table-cell"
      className={`p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 ${className}`}
    />
}

module Caption = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <caption
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="table-caption"
      className={`text-muted-foreground mt-4 text-sm ${className}`}
    />
}
