@@directive("'use client'")

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
  <BaseUi.Menu.Root
    ?children
    ?open_
    ?defaultOpen
    ?onOpenChange
    ?onOpenChangeComplete
    ?modal
    dataSlot="dropdown-menu"
  />

module Portal = {
  @react.component
  let make = (~children=?, ~container=?) =>
    <BaseUi.Menu.Portal ?children ?container dataSlot="dropdown-menu-portal" />
}

module Trigger = {
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
    ~render=?,
    ~nativeButton=?,
    ~type_=?,
    ~ariaLabel=?,
  ) =>
    <BaseUi.Menu.Trigger
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
      ?children
      dataSlot="dropdown-menu-trigger"
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
    ~onKeyDownCapture=?,
    ~align=Align.Start,
    ~alignOffset=0.,
    ~side=Side.Bottom,
    ~sideOffset=4.,
  ) =>
    <BaseUi.Menu.Portal>
      <BaseUi.Menu.Positioner
        className="isolate z-50 outline-none" align alignOffset side sideOffset
      >
        <BaseUi.Menu.Popup
          ?id
          ?style
          ?onClick
          ?onKeyDown
          ?onKeyDownCapture
          ?children
          dataSlot="dropdown-menu-content"
          className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 cn-menu-target z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg p-1 shadow-md ring-1 duration-100 outline-none data-closed:overflow-hidden ${className}`}
        />
      </BaseUi.Menu.Positioner>
    </BaseUi.Menu.Portal>
}

module Group = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?) =>
    <BaseUi.Menu.Group ?id ?style ?children dataSlot="dropdown-menu-group" className />
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
    ~dataInset=?,
  ) =>
    <BaseUi.Menu.GroupLabel
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?dataInset
      ?children
      dataSlot="dropdown-menu-label"
      className={`text-muted-foreground px-1.5 py-1 text-xs font-medium data-inset:pl-7 ${className}`}
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
    ~closeOnClick=?,
    ~dataInset=?,
    ~dataVariant=Variant.Default,
  ) => {
    let variant = dataVariant
    <BaseUi.Menu.Item
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?disabled
      ?closeOnClick
      ?dataInset
      ?children
      dataSlot="dropdown-menu-item"
      dataVariant={variant}
      className={`focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-accent-foreground group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${className}`}
    />
  }
}

module CheckboxItem = {
  @react.component
  let make = (
    ~className="",
    ~children=React.null,
    ~id=?,
    ~style=?,
    ~checked=?,
    ~defaultChecked=?,
    ~onCheckedChange=?,
    ~disabled=?,
    ~closeOnClick=?,
    ~dataInset=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <BaseUi.Menu.CheckboxItem
      ?id
      ?style
      ?checked
      ?defaultChecked
      ?onCheckedChange
      ?disabled
      ?closeOnClick
      ?dataInset
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="dropdown-menu-checkbox-item"
      className={`focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${className}`}
    >
      <span className="pointer-events-none absolute right-2 flex items-center justify-center">
        <BaseUi.Menu.CheckboxItemIndicator>
          {"✓"->React.string}
        </BaseUi.Menu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseUi.Menu.CheckboxItem>
}

module RadioGroup = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~value=?, ~onValueChange=?) =>
    <BaseUi.Menu.RadioGroup
      ?id ?style ?value ?onValueChange ?children dataSlot="dropdown-menu-radio-group" className
    />
}

module RadioItem = {
  @react.component
  let make = (
    ~className="",
    ~children=React.null,
    ~id=?,
    ~style=?,
    ~value=?,
    ~disabled=?,
    ~closeOnClick=?,
    ~dataInset=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <BaseUi.Menu.RadioItem
      ?id
      ?style
      ?value
      ?disabled
      ?closeOnClick
      ?dataInset
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="dropdown-menu-radio-item"
      className={`focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${className}`}
    >
      <span className="pointer-events-none absolute right-2 flex items-center justify-center">
        <BaseUi.Menu.RadioItemIndicator> {"✓"->React.string} </BaseUi.Menu.RadioItemIndicator>
      </span>
      {children}
    </BaseUi.Menu.RadioItem>
}

module Separator = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?) =>
    <BaseUi.Menu.Separator
      ?id
      ?style
      ?children
      dataSlot="dropdown-menu-separator"
      className={`bg-border -mx-1 my-1 h-px ${className}`}
    />
}

module Shortcut = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <span
      ?id
      ?style
      ?onClick
      ?onKeyDown
      className={`text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground ml-auto text-xs tracking-widest ${className}`}
      ?children
    />
}

module Sub = {
  @react.component
  let make = (~children=?, ~open_=?, ~defaultOpen=?, ~onOpenChange=?) =>
    <BaseUi.Menu.SubmenuRoot
      ?children ?open_ ?defaultOpen ?onOpenChange dataSlot="dropdown-menu-sub"
    />
}

module SubTrigger = {
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
    ~dataInset=?,
  ) =>
    <BaseUi.Menu.SubmenuTrigger
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?disabled
      ?dataInset
      dataSlot="dropdown-menu-sub-trigger"
      className={`focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${className}`}
    >
      {children}
      <span className="cn-rtl-flip ml-auto"> {">"->React.string} </span>
    </BaseUi.Menu.SubmenuTrigger>
}

module SubContent = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~align=Align.Start,
    ~alignOffset=-3.,
    ~side=Side.Right,
    ~sideOffset=0.,
  ) =>
    <Content
      ?children
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      align
      alignOffset
      side
      sideOffset
      className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground w-auto min-w-[96px] rounded-md p-1 shadow-lg ring-1 duration-100 ${className}`}
    />
}
