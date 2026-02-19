@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@react.component
let make = (~className="", ~children=?, ~id=?, ~ratio=1., ~onClick=?, ~onKeyDown=?) => {
  <div
    ?id
    ?children
    ?onClick
    ?onKeyDown
    dataSlot="aspect-ratio"
    style={ReactDOM.Style.unsafeAddStyle({}, {"--ratio": ratio})}
    className={`relative aspect-(--ratio) ${className}`}
  />
}
