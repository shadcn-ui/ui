@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

open BaseUi.Types
module CommandPrimitive = {
  @module("cmdk")
  external make: React.component<props<'value, 'checked>> = "Command"

  module Input = {
    @module("cmdk") @scope("Command")
    external make: React.component<props<'value, 'checked>> = "Input"
  }

  module List = {
    @module("cmdk") @scope("Command")
    external make: React.component<props<'value, 'checked>> = "List"
  }

  module Empty = {
    @module("cmdk") @scope("Command")
    external make: React.component<props<'value, 'checked>> = "Empty"
  }

  module Group = {
    @module("cmdk") @scope("Command")
    external make: React.component<props<'value, 'checked>> = "Group"
  }

  module Separator = {
    @module("cmdk") @scope("Command")
    external make: React.component<props<'value, 'checked>> = "Separator"
  }

  module Item = {
    @module("cmdk") @scope("Command")
    external make: React.component<props<'value, 'checked>> = "Item"
  }
}

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~style=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~onKeyDownCapture=?,
  ~value=?,
  ~defaultValue=?,
  ~onValueChange=?,
) =>
  <CommandPrimitive
    ?id
    ?style
    ?onClick
    ?onKeyDown
    ?onKeyDownCapture
    ?value
    ?defaultValue
    ?onValueChange
    dataSlot="command"
    className={`bg-popover text-popover-foreground flex size-full flex-col overflow-hidden rounded-xl! p-1 ${className}`}
   ?children />

module Dialog = {
  @react.component
  let make = (
    ~className="",
    ~children=React.null,
    ~open_=?,
    ~defaultOpen=?,
    ~onOpenChange=?,
    ~onOpenChangeComplete=?,
    ~modal=?,
    ~title="Command Palette",
    ~description="Search for a command to run...",
    ~showCloseButton=false,
  ) =>
    <BaseUi.Dialog.Root
      ?open_ ?defaultOpen ?onOpenChange ?onOpenChangeComplete ?modal dataSlot="dialog"
    >
      <BaseUi.Dialog.Title className="sr-only"> {title->React.string} </BaseUi.Dialog.Title>
      <BaseUi.Dialog.Description className="sr-only">
        {description->React.string}
      </BaseUi.Dialog.Description>
      <BaseUi.Dialog.Portal dataSlot="dialog-portal">
        <BaseUi.Dialog.Backdrop
          dataSlot="dialog-overlay"
          className="data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs"
        />
        <BaseUi.Dialog.Popup
          dataSlot="dialog-content"
          className={`bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/10 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-4 text-sm ring-1 duration-100 outline-none sm:max-w-sm top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0 ${className}`}
        >
          {children}
          {showCloseButton
            ? <BaseUi.Dialog.Close
                dataSlot="dialog-close"
                render={<Button
                  className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg absolute top-2 right-2"
                />}
              >
                <Icons.X />
                <span className="sr-only"> {"Close"->React.string} </span>
              </BaseUi.Dialog.Close>
            : React.null}
        </BaseUi.Dialog.Popup>
      </BaseUi.Dialog.Portal>
    </BaseUi.Dialog.Root>
}

module Input = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~value=?,
    ~defaultValue=?,
    ~onValueChange=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~placeholder=?,
  ) => {
    let wrapperProps: BaseUi.Types.props<string, bool> = {
      className: "",
      dataSlot: "command-input-wrapper",
    }
    <div {...wrapperProps} className="p-1 pb-0">
      <InputGroup
        className="bg-input/30 border-input/30 h-8! rounded-lg! shadow-none! *:data-[slot=input-group-addon]:pl-2!"
      >
        <CommandPrimitive.Input
          ?id
          ?style
          ?value
          ?defaultValue
          ?onValueChange
          ?onClick
          ?onKeyDown
          ?onKeyDownCapture
          ?placeholder
          ?children
          dataSlot="command-input"
          className={`w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        />
        <InputGroup.Addon>
          <Icons.Search className="size-4 shrink-0 opacity-50" />
        </InputGroup.Addon>
      </InputGroup>
    </div>
  }
}

module List = {
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
    <CommandPrimitive.List
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="command-list"
      className={`no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none ${className}`}
     ?children />
}

module Empty = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?) =>
    <CommandPrimitive.Empty
      ?id ?style dataSlot="command-empty" className={`py-6 text-center text-sm ${className}`}
     ?children />
}

module Group = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~heading=?) =>
    <CommandPrimitive.Group
      ?id
      ?style
      ?heading
      dataSlot="command-group"
      className={`text-foreground **:[[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium ${className}`}
     ?children />
}

module Separator = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?) =>
    <CommandPrimitive.Separator
      ?id
      ?style
      ?children
      dataSlot="command-separator"
      className={`bg-border -mx-1 h-px ${className}`}
    />
}

module Item = {
  @react.component
  let make = (
    ~className="",
    ~children=React.null,
    ~id=?,
    ~style=?,
    ~value=?,
    ~onSelect=?,
    ~disabled=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <CommandPrimitive.Item
      ?id
      ?style
      ?value
      ?onSelect
      ?disabled
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="command-item"
      className={`data-selected:bg-muted data-selected:text-foreground data-selected:*:[svg]:text-foreground group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${className}`}
    >
      {children}
      <Icons.Check
        className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
      />
    </CommandPrimitive.Item>
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
    ~onKeyDownCapture=?,
  ) => {
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?children,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "command-shortcut",
    }
    <span
      {...props}
      className={`text-muted-foreground group-data-selected/command-item:text-foreground ml-auto text-xs tracking-widest ${className}`}
     ?children />
  }
}
