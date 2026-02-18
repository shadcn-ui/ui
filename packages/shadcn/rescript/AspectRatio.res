@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

open BaseUi.Types

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~ratio=1.,
  ~onClick=?,
  ~onKeyDown=?,
  ~onKeyDownCapture=?,
) => {
  <div
    ?id
    ?children
    ?onClick
    ?onKeyDown
    ?onKeyDownCapture
    dataSlot="aspect-ratio"
    style={ReactDOM.Style.unsafeAddStyle({}, {"--ratio": ratio})}
    className={`relative aspect-(--ratio) ${className}`}
  />
}
