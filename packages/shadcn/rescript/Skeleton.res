@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

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
    ?children
    ?style
    ?onClick
    ?onKeyDown
    ?onKeyDownCapture
    dataSlot="skeleton"
    className={`bg-muted animate-pulse rounded-md ${className}`}
  />
}
