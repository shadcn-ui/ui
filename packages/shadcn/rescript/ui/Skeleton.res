@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@react.component
let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
  <div
    ?id
    ?children
    ?style
    ?onClick
    ?onKeyDown
    dataSlot="skeleton"
    className={`bg-muted animate-pulse rounded-md ${className}`}
  />
}
