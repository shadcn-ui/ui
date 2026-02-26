@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~style=?,
  ~ratio=?,
  ~onClick=?,
  ~onKeyDown=?,
) => {
  let style = switch style {
  | Some(style) => Some(style)
  | None =>
    switch ratio {
    | Some(ratio) => Some(ReactDOM.Style.unsafeAddStyle({}, {"--ratio": ratio}))
    | None => None
    }
  }
  let resolvedClassName = if className == "" {
    "relative aspect-(--ratio)"
  } else {
    `relative aspect-(--ratio) ${className}`
  }
  <div
    ?id
    ?style
    ?children
    ?onClick
    ?onKeyDown
    dataSlot="aspect-ratio"
    className={resolvedClassName}
  />
}
