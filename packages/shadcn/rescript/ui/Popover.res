@@directive("'use client'")

@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

open BaseUi.Types

@react.component
let make = (
  ~children=?,
  ~open_=?,
  ~defaultOpen=?,
  ~onOpenChange=?,
  ~onOpenChangeComplete=?,
  ~modal=?,
) =>
  <BaseUi.Popover.Root
    ?children ?open_ ?defaultOpen ?onOpenChange ?onOpenChangeComplete ?modal dataSlot="popover"
  />

module Trigger = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~disabled=?,
    ~render=?,
    ~nativeButton=?,
    ~type_=?,
    ~ariaLabel=?,
  ) =>
    <BaseUi.Popover.Trigger
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?disabled
      ?render
      ?nativeButton
      ?type_
      ?ariaLabel
      ?children
      dataSlot="popover-trigger"
      className
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
    ~align=Align.Center,
    ~alignOffset=0.,
    ~side=Side.Bottom,
    ~sideOffset=4.,
  ) =>
    <BaseUi.Popover.Portal>
      <BaseUi.Popover.Positioner align alignOffset side sideOffset className="isolate z-50">
        <BaseUi.Popover.Popup
          ?id
          ?style
          ?onClick
          ?onKeyDown
          ?children
          dataSlot="popover-content"
          className={`bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg p-2.5 text-sm shadow-md ring-1 outline-hidden duration-100 ${className}`}
        />
      </BaseUi.Popover.Positioner>
    </BaseUi.Popover.Portal>
}

module Header = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~dataSlot="popover-header",
  ) =>
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      dataSlot
      className={`flex flex-col gap-0.5 text-sm ${className}`}
      ?children
    />
}

module Title = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~dataSlot="popover-title",
  ) =>
    <BaseUi.Popover.Title
      ?id ?style ?onClick ?onKeyDown ?children dataSlot className={`font-medium ${className}`}
    />
}

module Description = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~dataSlot="popover-description",
  ) =>
    <BaseUi.Popover.Description
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot
      className={`text-muted-foreground ${className}`}
    />
}
