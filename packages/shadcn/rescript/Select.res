@@directive("'use client'")

open BaseUi.Types

@react.component
let make = (
  ~children=?,
  ~open_=?,
  ~defaultOpen=?,
  ~onOpenChange=?,
  ~onOpenChangeComplete=?,
  ~value=?,
  ~defaultValue=?,
  ~onValueChange=?,
  ~items=?,
  ~itemToStringLabel=?,
  ~itemToStringValue=?,
  ~isItemEqualToValue=?,
  ~onItemHighlighted=?,
  ~name=?,
  ~required=?,
  ~disabled=?,
  ~readOnly=?,
) =>
  <BaseUi.Select.Root
    ?children
    ?open_
    ?defaultOpen
    ?onOpenChange
    ?onOpenChangeComplete
    ?value
    ?defaultValue
    ?onValueChange
    ?items
    ?itemToStringLabel
    ?itemToStringValue
    ?isItemEqualToValue
    ?onItemHighlighted
    ?name
    ?required
    ?disabled
    ?readOnly
  />

module Group = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <BaseUi.Select.Group
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?children
      dataSlot="select-group"
      className={`scroll-my-1 p-1 ${className}`}
    />
}

module Value = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~placeholder=?) =>
    <BaseUi.Select.Value
      ?id
      ?style
      ?placeholder
      ?children
      dataSlot="select-value"
      className={`flex flex-1 text-left ${className}`}
    />
}

module Trigger = {
  @react.component
  let make = (
    ~className="",
    ~children=React.null,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~disabled=?,
    ~render=?,
    ~nativeButton=?,
    ~type_=?,
    ~ariaLabel=?,
    ~dataSize=Size.Default,
  ) => {
    let size = dataSize
    let hasWidthOverride = String.includes(className, "w-")
    let widthClass = hasWidthOverride ? "" : "w-fit"
    let content =
      <>
        {children}
        <BaseUi.Select.Icon
          render={<Icons.ChevronDown
            className="text-muted-foreground pointer-events-none size-4"
          />}
        />
      </>
    let shouldSetDefaultType = switch (type_, nativeButton, render) {
    | (None, Some(false), _)
    | (None, _, Some(_))
    | (Some(_), _, _) => false
    | (None, _, _) => true
    }
    if shouldSetDefaultType {
      <BaseUi.Select.Trigger
        ?id
        ?style
        ?onClick
        ?onKeyDown
        ?onKeyDownCapture
        ?disabled
        ?render
        ?nativeButton
        type_="button"
        ?ariaLabel
        dataSlot="select-trigger"
        dataSize={size}
        className={`border-input data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 flex ${widthClass} items-center justify-between gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${className}`}
      >
        {content}
      </BaseUi.Select.Trigger>
    } else {
      <BaseUi.Select.Trigger
        ?id
        ?style
        ?onClick
        ?onKeyDown
        ?onKeyDownCapture
        ?disabled
        ?render
        ?nativeButton
        ?type_
        ?ariaLabel
        dataSlot="select-trigger"
        dataSize={size}
        className={`border-input data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 flex ${widthClass} items-center justify-between gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${className}`}
      >
        {content}
      </BaseUi.Select.Trigger>
    }
  }
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
    ~side=Side.Bottom,
    ~sideOffset=4.,
    ~align=Align.Center,
    ~alignOffset=0.,
    ~dataAlignTrigger=true,
  ) => {
    let alignItemWithTrigger = dataAlignTrigger
    <BaseUi.Select.Portal>
      <BaseUi.Select.Positioner
        side sideOffset align alignOffset alignItemWithTrigger className="isolate z-50"
      >
        <BaseUi.Select.Popup
          ?id
          ?style
          ?onClick
          ?onKeyDown
          ?onKeyDownCapture
          dataSlot="select-content"
          dataAlignTrigger={alignItemWithTrigger}
          className={`bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 cn-menu-target relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg shadow-md ring-1 duration-100 data-[align-trigger=true]:animate-none ${className}`}
        >
          <BaseUi.Select.ScrollUpArrow
            dataSlot="select-scroll-up-button"
            className="bg-popover top-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4"
          >
            <Icons.ChevronUp />
          </BaseUi.Select.ScrollUpArrow>
          <BaseUi.Select.List ?children />
          <BaseUi.Select.ScrollDownArrow
            dataSlot="select-scroll-down-button"
            className="bg-popover bottom-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4"
          >
            <Icons.ChevronDown />
          </BaseUi.Select.ScrollDownArrow>
        </BaseUi.Select.Popup>
      </BaseUi.Select.Positioner>
    </BaseUi.Select.Portal>
  }
}

module Label = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <BaseUi.Select.GroupLabel
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?children
      dataSlot="select-label"
      className={`text-muted-foreground px-1.5 py-1 text-xs ${className}`}
    />
}

module Item = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~disabled=?,
    ~value=?,
    ~label=?,
  ) =>
    <BaseUi.Select.Item
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?disabled
      ?value
      ?label
      dataSlot="select-item"
      className={`focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 ${className}`}
    >
      <BaseUi.Select.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap" ?children />
      <BaseUi.Select.ItemIndicator
        render={<span
          className="pointer-events-none absolute right-2 flex size-4 items-center justify-center"
        />}
      >
        <Icons.Check className="pointer-events-none" />
      </BaseUi.Select.ItemIndicator>
    </BaseUi.Select.Item>
}

module Separator = {
  @react.component
  let make = (~className="", ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?, ~onKeyDownCapture=?) =>
    <BaseUi.Select.Separator
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="select-separator"
      className={`bg-border pointer-events-none -mx-1 my-1 h-px ${className}`}
    />
}

module ScrollUpButton = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <BaseUi.Select.ScrollUpArrow
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="select-scroll-up-button"
      className={`bg-popover top-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 ${className}`}
    >
      {children->Option.getOr(<Icons.ChevronUp />)}
    </BaseUi.Select.ScrollUpArrow>
}

module ScrollDownButton = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <BaseUi.Select.ScrollDownArrow
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="select-scroll-down-button"
      className={`bg-popover bottom-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 ${className}`}
    >
      {children->Option.getOr(<Icons.ChevronDown />)}
    </BaseUi.Select.ScrollDownArrow>
}
