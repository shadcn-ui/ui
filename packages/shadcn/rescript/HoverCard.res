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
  ~onOpenChangeComplete=?,
  ~delay=?,
  ~closeDelay=?,
  ~style=?,
) =>
  <BaseUi.PreviewCard.Root
    ?className
    ?children
    ?id
    ?open_
    ?defaultOpen
    ?onOpenChange
    ?onOpenChangeComplete
    ?delay
    ?closeDelay
    ?style
    dataSlot="hover-card"
  />

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
    ~delay=?,
    ~closeDelay=?,
    ~render=?,
    ~style=?,
  ) =>
    <BaseUi.PreviewCard.Trigger
      ?className
      ?children
      ?id
      ?disabled
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?ariaLabel
      ?delay
      ?closeDelay
      ?render
      ?style
      dataSlot="hover-card-trigger"
    />
}

module Content = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~align=Align.Center,
    ~alignOffset=4.,
    ~side=Side.Bottom,
    ~sideOffset=4.,
  ) =>
    <BaseUi.PreviewCard.Portal dataSlot="hover-card-portal">
      <BaseUi.PreviewCard.Positioner align alignOffset side sideOffset className="isolate z-50">
        <BaseUi.PreviewCard.Popup
          ?id
          ?style
          ?onClick
          ?onKeyDown
          ?onKeyDownCapture
          ?children
          dataSlot="hover-card-content"
          className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 z-50 w-64 origin-(--transform-origin) rounded-lg p-2.5 text-sm shadow-md ring-1 outline-hidden duration-100 ${className}`}
        />
      </BaseUi.PreviewCard.Positioner>
    </BaseUi.PreviewCard.Portal>
}
