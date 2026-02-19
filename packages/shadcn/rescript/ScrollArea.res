@@directive("'use client'")

open BaseUi.Types

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~style=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~tabIndex=?,
  ~ariaLabel=?,
  ~orientation=?,
) =>
  <BaseUi.ScrollArea.Root
    ?id
    ?style
    ?onClick
    ?onKeyDown
    ?tabIndex
    ?ariaLabel
    ?orientation
    dataSlot="scroll-area"
    className={`relative ${className}`}
  >
    <BaseUi.ScrollArea.Viewport
      dataSlot="scroll-area-viewport"
      className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
     ?children />
    <BaseUi.ScrollArea.Scrollbar
      dataSlot="scroll-area-scrollbar"
      orientation={Orientation.Vertical}
      className="flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent"
    >
      <BaseUi.ScrollArea.Thumb
        dataSlot="scroll-area-thumb" className="bg-border relative flex-1 rounded-full"
      />
    </BaseUi.ScrollArea.Scrollbar>
    <BaseUi.ScrollArea.Corner />
  </BaseUi.ScrollArea.Root>

module ScrollBar = {
  @react.component
  let make = (
    ~className="",
    ~children=React.null,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~orientation=Orientation.Vertical,
  ) =>
    <BaseUi.ScrollArea.Scrollbar
      ?id
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="scroll-area-scrollbar"
      orientation
      className={`flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent ${className}`}
    >
      <BaseUi.ScrollArea.Thumb
        dataSlot="scroll-area-thumb" className="bg-border relative flex-1 rounded-full"
      />
      {children}
    </BaseUi.ScrollArea.Scrollbar>
}
