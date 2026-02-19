@@directive("'use client'")

@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

open BaseUi.Types

@react.component
let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
  <BaseUi.Menubar
    ?id
    ?style
    ?onClick
    ?onKeyDown
    ?children
    dataSlot="menubar"
    className={`bg-background flex h-8 items-center gap-0.5 rounded-lg border p-[3px] ${className}`}
  />

module Menu = {
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
      dataSlot="menubar-menu"
    />
}

module Group = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?) =>
    <BaseUi.Menu.Group ?id ?style ?children dataSlot="menubar-group" className />
}

module Portal = {
  @react.component
  let make = (~children=?, ~container=?) =>
    <BaseUi.Menu.Portal ?children ?container dataSlot="menubar-portal" />
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
    ~disabled=?,
    ~render=?,
    ~nativeButton=?,
    ~type_=?,
    ~ariaLabel=?,
  ) => {
    let shouldSetDefaultType = switch (type_, nativeButton, render) {
    | (None, Some(false), _)
    | (None, _, Some(_))
    | (Some(_), _, _) => false
    | (None, _, _) => true
    }
    if shouldSetDefaultType {
      <BaseUi.Menu.Trigger
        ?id
        ?style
        ?onClick
        ?onKeyDown
        ?disabled
        ?render
        ?nativeButton
        type_="button"
        ?ariaLabel
        ?children
        dataSlot="menubar-trigger"
        className={`hover:bg-muted aria-expanded:bg-muted flex items-center rounded-sm px-1.5 py-[2px] text-sm font-medium outline-hidden select-none ${className}`}
      />
    } else {
      <BaseUi.Menu.Trigger
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
        dataSlot="menubar-trigger"
        className={`hover:bg-muted aria-expanded:bg-muted flex items-center rounded-sm px-1.5 py-[2px] text-sm font-medium outline-hidden select-none ${className}`}
      />
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
    ~align=Align.Start,
    ~alignOffset=-4.,
    ~side=Side.Bottom,
    ~sideOffset=8.,
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
          ?children
          dataSlot="menubar-content"
          className={`bg-popover text-popover-foreground data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 cn-menu-target min-w-36 rounded-lg p-1 shadow-md ring-1 duration-100 ${className}`}
        />
      </BaseUi.Menu.Positioner>
    </BaseUi.Menu.Portal>
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
      ?disabled
      ?closeOnClick
      ?dataInset
      ?children
      dataSlot="menubar-item"
      dataVariant={variant}
      className={`focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! not-data-[variant=destructive]:focus:**:text-accent-foreground group/menubar-item gap-1.5 rounded-md px-1.5 py-1 text-sm data-disabled:opacity-50 data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 ${className}`}
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
      dataSlot="menubar-checkbox-item"
      className={`focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-1.5 pl-7 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${className}`}
    >
      <span
        className="pointer-events-none absolute left-1.5 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4"
      >
        <BaseUi.Menu.CheckboxItemIndicator>
          <Icons.Check />
        </BaseUi.Menu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseUi.Menu.CheckboxItem>
}

module RadioGroup = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~value=?, ~onValueChange=?) =>
    <BaseUi.Menu.RadioGroup
      ?id ?style ?value ?onValueChange ?children dataSlot="menubar-radio-group" className
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
      dataSlot="menubar-radio-item"
      className={`focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-1.5 pl-7 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${className}`}
    >
      <span
        className="pointer-events-none absolute left-1.5 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4"
      >
        <BaseUi.Menu.RadioItemIndicator>
          <Icons.Check />
        </BaseUi.Menu.RadioItemIndicator>
      </span>
      {children}
    </BaseUi.Menu.RadioItem>
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
    ~dataInset=?,
  ) =>
    <BaseUi.Menu.GroupLabel
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?dataInset
      ?children
      dataSlot="menubar-label"
      className={`px-1.5 py-1 text-sm font-medium data-inset:pl-7 ${className}`}
    />
}

module Separator = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?) =>
    <BaseUi.Menu.Separator
      ?id
      ?style
      ?children
      dataSlot="menubar-separator"
      className={`bg-border -mx-1 my-1 h-px ${className}`}
    />
}

module Shortcut = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~dataSlot="menubar-shortcut",
  ) =>
    <span
      ?id
      ?style
      ?onClick
      ?onKeyDown
      dataSlot
      className={`text-muted-foreground group-focus/menubar-item:text-accent-foreground ml-auto text-xs tracking-widest ${className}`}
      ?children
    />
}

module Sub = {
  @react.component
  let make = (~children=?, ~open_=?, ~defaultOpen=?, ~onOpenChange=?) =>
    <BaseUi.Menu.SubmenuRoot ?children ?open_ ?defaultOpen ?onOpenChange dataSlot="menubar-sub" />
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
    ~disabled=?,
    ~dataInset=?,
  ) =>
    <BaseUi.Menu.SubmenuTrigger
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?disabled
      ?dataInset
      dataSlot="menubar-sub-trigger"
      className={`focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground gap-1.5 rounded-md px-1.5 py-1 text-sm data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 ${className}`}
    >
      {children}
      <Icons.ChevronRight className="cn-rtl-flip ml-auto" />
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
    ~align=Align.Start,
    ~alignOffset=-3.,
    ~side=Side.Right,
    ~sideOffset=0.,
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
          ?children
          dataSlot="menubar-sub-content"
          className={`bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-32 rounded-lg p-1 shadow-lg ring-1 duration-100 ${className}`}
        />
      </BaseUi.Menu.Positioner>
    </BaseUi.Menu.Portal>
}
