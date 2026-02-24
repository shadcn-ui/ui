@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~dataSlot="label",
  ~htmlFor=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~style=?,
) => {
  <label
    ?id
    ?children
    ?htmlFor
    ?onClick
    ?onKeyDown
    ?style
    dataSlot
    className={`flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${className}`}
  />
}
