@@directive("'use client'")

open BaseUi.Types

@react.component
let make = (~className="", ~id=?, ~style=?, ~orientation=Orientation.Horizontal, ~children=?) =>
  <BaseUi.Separator
    ?id
    ?style
    ?children
    orientation
    dataSlot="separator"
    className={`bg-border shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch ${className}`}
  />
