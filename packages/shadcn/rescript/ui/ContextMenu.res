@@directive("'use client'")

@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

open BaseUi.Types

module Variant = {
  @unboxed
  type t =
    | @as("default") Default
    | @as("destructive") Destructive
}

@react.component
let make = (
  ~children=?,
  ~open_=?,
  ~defaultOpen=?,
  ~onOpenChange=?,
  ~onOpenChangeComplete=?,
  ~modal=?,
) =>
  <BaseUi.ContextMenu.Root
    ?children ?open_ ?defaultOpen ?onOpenChange ?onOpenChangeComplete ?modal dataSlot="context-menu"
  />

module Portal = {
  @react.component
  let make = (~children=?, ~container=?) =>
    <BaseUi.ContextMenu.Portal ?children ?container dataSlot="context-menu-portal" />
}

module Trigger = {
  @react.component
  let make = (
    ~className="",
    ~dataSlot="context-menu-content",
    ~children=?,
    ~id=?,
    ~style=?,
    ~disabled=?,
    ~render=?,
    ~onClick=?,
    ~onKeyDown=?,
  ) =>
    <BaseUi.ContextMenu.Trigger
      ?id
      ?style
      ?disabled
      ?render
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="context-menu-trigger"
      className={`select-none ${className}`}
    />
}

module Content = {
  @react.component
  let make = (
    ~className="",
    ~dataSlot="context-menu-content",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~align=Align.Start,
    ~alignOffset=4.,
    ~side=Side.Right,
    ~sideOffset=0.,
  ) => {
    <BaseUi.ContextMenu.Portal>
      <BaseUi.ContextMenu.Positioner
        className="isolate z-50 outline-none" align alignOffset side sideOffset
      >
        <BaseUi.ContextMenu.Popup
          ?id
          ?style
          ?onClick
          ?onKeyDown
          ?children
          dataSlot
          className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 cn-menu-target z-50 max-h-(--available-height) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg p-1 shadow-md ring-1 duration-100 outline-none ${className}`}
        />
      </BaseUi.ContextMenu.Positioner>
    </BaseUi.ContextMenu.Portal>
  }
}

module Group = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?) =>
    <BaseUi.ContextMenu.Group ?id ?style ?children dataSlot="context-menu-group" className />
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
    <BaseUi.ContextMenu.GroupLabel
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?dataInset
      ?children
      dataSlot="context-menu-label"
      className={`text-muted-foreground px-1.5 py-1 text-xs font-medium data-inset:pl-7 ${className}`}
    />
}

module Item = {
  @react.component
  let make = (
    ~className="",
    ~inset=?,
    ~variant=Variant.Default,
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~disabled=?,
    ~closeOnClick=?,
  ) => {
    <BaseUi.ContextMenu.Item
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?disabled
      ?closeOnClick
      dataInset=?inset
      ?children
      dataSlot="context-menu-item"
      dataVariant={(variant :> string)}
      className={`focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive focus:*:[svg]:text-accent-foreground group/context-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${className}`}
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
    <BaseUi.ContextMenu.CheckboxItem
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
      dataSlot="context-menu-checkbox-item"
      className={`focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${className}`}
    >
      <span className="pointer-events-none absolute right-2">
        <BaseUi.ContextMenu.CheckboxItemIndicator>
          <Icons.Check />
        </BaseUi.ContextMenu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseUi.ContextMenu.CheckboxItem>
}

module RadioGroup = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~value=?, ~onValueChange=?) =>
    <BaseUi.ContextMenu.RadioGroup
      ?id ?style ?value ?onValueChange ?children dataSlot="context-menu-radio-group" className
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
    <BaseUi.ContextMenu.RadioItem
      ?id
      ?style
      ?value
      ?disabled
      ?closeOnClick
      ?dataInset
      ?onClick
      ?onKeyDown
      dataSlot="context-menu-radio-item"
      className={`focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${className}`}
    >
      <span className="pointer-events-none absolute right-2 flex items-center justify-center">
        <BaseUi.ContextMenu.RadioItemIndicator>
          <Icons.Check />
        </BaseUi.ContextMenu.RadioItemIndicator>
      </span>
      {children}
    </BaseUi.ContextMenu.RadioItem>
}

module Separator = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?) =>
    <BaseUi.ContextMenu.Separator
      ?id
      ?style
      ?children
      dataSlot="context-menu-separator"
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
      dataSlot="context-menu-shortcut"
      className={`text-muted-foreground group-focus/context-menu-item:text-accent-foreground ml-auto text-xs tracking-widest ${className}`}
      ?children
    />
}

module Sub = {
  @react.component
  let make = (~children=?, ~open_=?, ~defaultOpen=?, ~onOpenChange=?) =>
    <BaseUi.ContextMenu.SubmenuRoot
      ?children ?open_ ?defaultOpen ?onOpenChange dataSlot="context-menu-sub"
    />
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
    ~alignOffset=4.,
    ~side=Side.Right,
    ~sideOffset=0.,
  ) =>
    <Content
      ?children
      ?id
      ?style
      ?onClick
      ?onKeyDown
      align
      alignOffset
      side
      sideOffset
      dataSlot="context-menu-sub-content"
      className={`shadow-lg ${className}`}
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
    ~disabled=?,
    ~dataInset=?,
  ) =>
    <BaseUi.ContextMenu.SubmenuTrigger
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?disabled
      ?dataInset
      dataSlot="context-menu-sub-trigger"
      className={`focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${className}`}
    >
      {children}
      <Icons.ChevronRight className="cn-rtl-flip ml-auto" />
    </BaseUi.ContextMenu.SubmenuTrigger>
}
