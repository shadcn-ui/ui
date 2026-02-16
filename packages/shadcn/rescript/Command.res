open BaseUi.Types
external toDomProps: 'a => JsxDOM.domProps = "%identity"

module CommandPrimitive = {
  @module("cmdk")
  external make: React.component<props<string, bool>> = "Command"

  module Input = {
    @module("cmdk") @scope("Command")
    external make: React.component<props<string, bool>> = "Input"
  }

  module List = {
    @module("cmdk") @scope("Command")
    external make: React.component<props<string, bool>> = "List"
  }

  module Empty = {
    @module("cmdk") @scope("Command")
    external make: React.component<props<string, bool>> = "Empty"
  }

  module Group = {
    @module("cmdk") @scope("Command")
    external make: React.component<props<string, bool>> = "Group"
  }

  module Separator = {
    @module("cmdk") @scope("Command")
    external make: React.component<props<string, bool>> = "Separator"
  }

  module Item = {
    @module("cmdk") @scope("Command")
    external make: React.component<propsWithChildren<string, bool>> = "Item"
  }
}

@react.componentWithProps
let make = (props: props<string, bool>) =>
  <CommandPrimitive
    {...props}
    dataSlot="command"
    className={`bg-popover text-popover-foreground flex size-full flex-col overflow-hidden rounded-xl! p-1 ${props.className->Option.getOr(
        "",
      )}`}
  />

module Dialog = {
  @react.componentWithProps
  let make = (props: propsWithChildren<string, bool>) => {
    let title = props.title->Option.getOr("Command Palette")
    let description = props.description->Option.getOr("Search for a command to run...")
    let showCloseButton = props.showCloseButton->Option.getOr(false)
    <BaseUi.Dialog.Root {...props} dataSlot="dialog">
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
          className={`bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/10 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-4 text-sm ring-1 duration-100 outline-none sm:max-w-sm top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0 ${props.className->Option.getOr(
              "",
            )}`}
        >
          {props.children}
          {if showCloseButton {
            <BaseUi.Dialog.Close
              dataSlot="dialog-close"
              render={<Button
                className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg absolute top-2 right-2"
              />}
            >
              <Icons.x />
              <span className="sr-only"> {"Close"->React.string} </span>
            </BaseUi.Dialog.Close>
          } else {
            React.null
          }}
        </BaseUi.Dialog.Popup>
      </BaseUi.Dialog.Portal>
    </BaseUi.Dialog.Root>
  }
}

module Input = {
  @react.componentWithProps
  let make = (props: props<string, bool>) => {
    let wrapperProps: props<string, bool> = {
      className: "",
      dataSlot: "command-input-wrapper",
    }
    <div {...toDomProps(wrapperProps)} className="p-1 pb-0">
      <InputGroup
        className="bg-input/30 border-input/30 h-8! rounded-lg! shadow-none! *:data-[slot=input-group-addon]:pl-2!"
      >
        <CommandPrimitive.Input
          {...props}
          dataSlot="command-input"
          className={`w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50 ${props.className->Option.getOr(
              "",
            )}`}
        />
        <InputGroup.Addon>
          <Icons.search className="size-4 shrink-0 opacity-50" />
        </InputGroup.Addon>
      </InputGroup>
    </div>
  }
}

module List = {
  @react.componentWithProps
  let make = (props: props<string, bool>) =>
    <CommandPrimitive.List
      {...props}
      dataSlot="command-list"
      className={`no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none ${props.className->Option.getOr(
          "",
        )}`}
    />
}

module Empty = {
  @react.componentWithProps
  let make = (props: props<string, bool>) =>
    <CommandPrimitive.Empty
      {...props}
      dataSlot="command-empty"
      className={`py-6 text-center text-sm ${props.className->Option.getOr("")}`}
    />
}

module Group = {
  @react.componentWithProps
  let make = (props: props<string, bool>) =>
    <CommandPrimitive.Group
      {...props}
      dataSlot="command-group"
      className={`text-foreground **:[[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium ${props.className->Option.getOr(
          "",
        )}`}
    />
}

module Separator = {
  @react.componentWithProps
  let make = (props: props<string, bool>) =>
    <CommandPrimitive.Separator
      {...props}
      dataSlot="command-separator"
      className={`bg-border -mx-1 h-px ${props.className->Option.getOr("")}`}
    />
}

module Item = {
  @react.componentWithProps
  let make = (props: propsWithChildren<string, bool>) =>
    <CommandPrimitive.Item
      {...props}
      dataSlot="command-item"
      className={`data-selected:bg-muted data-selected:text-foreground data-selected:*:[svg]:text-foreground group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr(
          "",
        )}`}
    >
      {props.children}
      <Icons.check
        className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
      />
    </CommandPrimitive.Item>
}

module Shortcut = {
  @react.componentWithProps
  let make = (props: props<string, bool>) => {
    let props = {...props, dataSlot: "command-shortcut"}
    <span
      {...toDomProps(props)}
      className={`text-muted-foreground group-data-selected/command-item:text-foreground ml-auto text-xs tracking-widest ${props.className->Option.getOr(
          "",
        )}`}
    />
  }
}
