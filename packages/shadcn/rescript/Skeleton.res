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
  let props: BaseUi.Types.props<string, bool> = {
    ?id,
    ?children,
    ?style,
    ?onClick,
    ?onKeyDown,
    ?onKeyDownCapture,
    className,
    dataSlot: "skeleton",
  }
  <div {...props} className={`bg-muted animate-pulse rounded-md ${className}`} />
}
