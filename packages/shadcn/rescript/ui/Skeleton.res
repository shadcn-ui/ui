@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~style=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~dataSidebar=?,
) => {
  <div
    ?id
    ?children
    ?style
    ?onClick
    ?onKeyDown
    ?dataSidebar
    dataSlot="skeleton"
    className={`bg-muted animate-pulse rounded-md ${className}`}
  />
}
