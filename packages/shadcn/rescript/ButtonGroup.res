@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

open BaseUi.Types

let buttonGroupVariants = (~orientation=DataOrientation.Horizontal) => {
  let base = "has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg flex w-fit items-stretch *:focus-visible:z-10 *:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1"
  let orientationClass = switch orientation {
  | Vertical => "[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg! flex-col [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0 *:data-slot:rounded-b-none"
  | Horizontal
  | Responsive => "[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0 *:data-slot:rounded-r-none"
  }
  `${base} ${orientationClass}`
}

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~style=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~onKeyDownCapture=?,
  ~dataOrientation=DataOrientation.Horizontal,
) => {
  let orientation = dataOrientation
  let props: BaseUi.Types.props<string, bool> = {
    ?id,
    ?style,
    ?onClick,
    ?onKeyDown,
    ?onKeyDownCapture,
    ?children,
    className,
    dataOrientation: orientation,
    dataSlot: "button-group",
  }
  <div
    {...props}
    role="group"
    className={`${buttonGroupVariants(~orientation)} ${className}`}
   ?children />
}

module Text = {
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
      ?style,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      ?children,
      className,
    }
    <div
      {...props}
      className={`bg-muted gap-2 rounded-lg border px-2.5 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 flex items-center [&_svg]:pointer-events-none ${className}`}
     ?children />
  }
}

module Separator = {
  @react.component
  let make = (~className="", ~id=?, ~style=?, ~orientation=Orientation.Vertical, ~children=?) =>
    <BaseUi.Separator
      ?id
      ?style
      ?children
      dataSlot="button-group-separator"
      orientation
      className={`bg-input relative self-stretch shrink-0 data-horizontal:mx-px data-horizontal:h-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto data-vertical:w-px data-vertical:self-stretch ${className}`}
    />
}
