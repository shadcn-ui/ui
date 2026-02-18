@@directive("'use client'")

open BaseUi.Types

@react.component
let make = (
  ~className=?,
  ~children=?,
  ~id=?,
  ~open_=?,
  ~defaultOpen=?,
  ~onOpenChange=?,
  ~delay=?,
  ~closeDelay=?,
  ~style=?,
) =>
  <BaseUi.Tooltip.Root
    ?className
    ?children
    ?id
    ?open_
    ?defaultOpen
    ?onOpenChange
    ?delay
    ?closeDelay
    ?style
    dataSlot="tooltip"
  />

module Provider = {
  @react.component
  let make = (~children=?, ~id=?, ~className=?, ~delay=0., ~closeDelay=?, ~style=?) =>
    <BaseUi.Tooltip.Provider
      ?children ?id ?className ?closeDelay ?style dataSlot="tooltip-provider" delay
    />
}

module Trigger = {
  @react.component
  let make = (
    ~className=?,
    ~children=?,
    ~id=?,
    ~disabled=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~ariaLabel=?,
    ~render=?,
    ~style=?,
  ) =>
    <BaseUi.Tooltip.Trigger
      ?className
      ?children
      ?id
      ?disabled
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?ariaLabel
      ?render
      ?style
      dataSlot="tooltip-trigger"
    />
}

module Content = {
  @react.component
  let make = (
    ~className="",
    ~children=React.null,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~align=Align.Center,
    ~alignOffset=0.,
    ~side=Side.Top,
    ~sideOffset=4.,
  ) =>
    <BaseUi.Tooltip.Portal>
      <BaseUi.Tooltip.Positioner align alignOffset side sideOffset className="isolate z-50">
        <BaseUi.Tooltip.Popup
          ?id
          ?style
          ?onClick
          ?onKeyDown
          ?onKeyDownCapture
          dataSlot="tooltip-content"
          className={`data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 bg-foreground text-background z-50 w-fit max-w-xs origin-(--transform-origin) rounded-md px-3 py-1.5 text-xs ${className}`}
        >
          {children}
          <BaseUi.Tooltip.Arrow
            className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5"
          />
        </BaseUi.Tooltip.Popup>
      </BaseUi.Tooltip.Positioner>
    </BaseUi.Tooltip.Portal>
}
