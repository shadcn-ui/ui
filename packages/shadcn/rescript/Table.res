@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

open BaseUi.Types

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
    ?style
    ?onClick
    ?onKeyDown
    ?onKeyDownCapture
    dataSlot="table-container"
    className="relative w-full overflow-x-auto"
  >
    <table
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?children
      dataSlot="table"
      className={`w-full caption-bottom text-sm ${className}`}
    />
  </div>
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
    <thead
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="table-header"
      className={`[&_tr]:border-b ${className}`}
    />
}

module Body = {
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
    <tbody
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="table-body"
      className={`[&_tr:last-child]:border-0 ${className}`}
    />
}

module Footer = {
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
    <tfoot
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
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
    ~onKeyDownCapture=?,
  ) =>
    <tr
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="table-row"
      className={`hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors ${className}`}
    />
}

module Head = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~colSpan=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <th
      ?id
      ?children
      ?style
      ?colSpan
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="table-head"
      className={`text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 ${className}`}
    />
}

module Cell = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~colSpan=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <td
      ?id
      ?children
      ?style
      ?colSpan
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="table-cell"
      className={`p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 ${className}`}
    />
}

module Caption = {
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
    <caption
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="table-caption"
      className={`text-muted-foreground mt-4 text-sm ${className}`}
    />
}
