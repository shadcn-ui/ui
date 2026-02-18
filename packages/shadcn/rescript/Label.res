@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

open BaseUi.Types

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~dataSlot="label",
  ~htmlFor=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~onKeyDownCapture=?,
  ~style=?,
) => {
  let props: BaseUi.Types.props<string, bool> = {
    ?id,
    ?children,
    ?htmlFor,
    ?onClick,
    ?onKeyDown,
    ?onKeyDownCapture,
    ?style,
    className,
    dataSlot,
  }
  <label
    {...props}
    className={`flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${className}`}
  />
}
