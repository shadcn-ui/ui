@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

open BaseUi.Types

module DataOrientation = {
  @unboxed
  type t =
    | @as("horizontal") Horizontal
    | @as("vertical") Vertical
}

let buttonGroupVariants = (~orientation=DataOrientation.Horizontal) => {
  let base = "has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg flex w-fit items-stretch *:focus-visible:z-10 *:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1"
  let orientationClass = switch orientation {
  | Vertical => "[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg! flex-col [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0 *:data-slot:rounded-b-none"
  | Horizontal => "[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0 *:data-slot:rounded-r-none"
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
  ~orientation=?,
  ~dataOrientation=?,
) => {
  let dataOrientation = switch (orientation, dataOrientation) {
  | (Some(orientation), _) => Some(orientation)
  | (None, Some(orientation)) => Some(orientation)
  | (None, None) => None
  }
  let resolvedOrientation = dataOrientation->Option.getOr(DataOrientation.Horizontal)
  let resolvedClassName = if className == "" {
    buttonGroupVariants(~orientation=resolvedOrientation)
  } else {
    `${buttonGroupVariants(~orientation=resolvedOrientation)} ${className}`
  }
  let dataOrientation = dataOrientation->Option.map(value => (value :> string))
  <div
    ?id
    ?style
    ?onClick
    ?onKeyDown
    ?children
    role="group"
    ?dataOrientation
    dataSlot="button-group"
    className={resolvedClassName}
  />
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
    ~render=?,
  ) => {
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?onClick,
      ?onKeyDown,
      ?children,
      dataSlot: "button-group-text",
      className: `bg-muted gap-2 rounded-lg border px-2.5 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 flex items-center [&_svg]:pointer-events-none ${className}`,
    }
    BaseUi.Render.use({defaultTagName: "div", props, ?render})
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
