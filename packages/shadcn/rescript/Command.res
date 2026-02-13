type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>
type primitiveProps = props<string, bool>
external toDomProps: props<'value, 'checked> => JsxDOM.domProps = "%identity"

module UiDialog = Dialog
module UiInputGroup = InputGroup

module CommandPrimitive = {
  @module("cmdk")
  external make: React.component<primitiveProps> = "Command"

  module Input = {
    @module("cmdk")
    @scope("Command")
    external make: React.component<primitiveProps> = "Input"
  }

  module List = {
    @module("cmdk")
    @scope("Command")
    external make: React.component<primitiveProps> = "List"
  }

  module Empty = {
    @module("cmdk")
    @scope("Command")
    external make: React.component<primitiveProps> = "Empty"
  }

  module Group = {
    @module("cmdk")
    @scope("Command")
    external make: React.component<primitiveProps> = "Group"
  }

  module Separator = {
    @module("cmdk")
    @scope("Command")
    external make: React.component<primitiveProps> = "Separator"
  }

  module Item = {
    @module("cmdk")
    @scope("Command")
    external make: React.component<primitiveProps> = "Item"
  }
}

@react.componentWithProps
let make = (props: primitiveProps) =>
  <CommandPrimitive.make
    {...props}
    dataSlot="command"
    className={`bg-popover text-popover-foreground flex size-full flex-col overflow-hidden rounded-xl! p-1 ${props.className->Option.getOr("")}`}
  />

module Dialog = {
  @react.componentWithProps
  let make = (props: primitiveProps) => {
    let title = props.title->Option.getOr("Command Palette")
    let description = props.description->Option.getOr("Search for a command to run...")
    let showCloseButton = props.showCloseButton->Option.getOr(false)
    <UiDialog.make {...props}>
      <UiDialog.Header.make className="sr-only">
        <UiDialog.Title.make>{title->React.string}</UiDialog.Title.make>
        <UiDialog.Description.make>{description->React.string}</UiDialog.Description.make>
      </UiDialog.Header.make>
      <UiDialog.Content.make
        className={`top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0 ${props.className->Option.getOr("")}`}
        showCloseButton
      >
        {props.children->Option.getOr(React.null)}
      </UiDialog.Content.make>
    </UiDialog.make>
  }
}

module Input = {
  @react.componentWithProps
  let make = (props: primitiveProps) => {
    let wrapperProps: primitiveProps = {
      className: "",
      children: React.null,
      dataSlot: "command-input-wrapper",
    }
    <div {...toDomProps(wrapperProps)} className="p-1 pb-0">
      <UiInputGroup.make className="bg-input/30 border-input/30 h-8! rounded-lg! shadow-none! *:data-[slot=input-group-addon]:pl-2!">
        <CommandPrimitive.Input.make
          {...props}
          dataSlot="command-input"
          className={`w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50 ${props.className->Option.getOr("")}`}
        />
        <UiInputGroup.Addon.make>
          <Icons.search className="size-4 shrink-0 opacity-50" />
        </UiInputGroup.Addon.make>
      </UiInputGroup.make>
    </div>
  }
}

module List = {
  @react.componentWithProps
  let make = (props: primitiveProps) =>
    <CommandPrimitive.List.make
      {...props}
      dataSlot="command-list"
      className={`no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none ${props.className->Option.getOr("")}`}
    />
}

module Empty = {
  @react.componentWithProps
  let make = (props: primitiveProps) =>
    <CommandPrimitive.Empty.make
      {...props}
      dataSlot="command-empty"
      className={`py-6 text-center text-sm ${props.className->Option.getOr("")}`}
    />
}

module Group = {
  @react.componentWithProps
  let make = (props: primitiveProps) =>
    <CommandPrimitive.Group.make
      {...props}
      dataSlot="command-group"
      className={`text-foreground **:[[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium ${props.className->Option.getOr("")}`}
    />
}

module Separator = {
  @react.componentWithProps
  let make = (props: primitiveProps) =>
    <CommandPrimitive.Separator.make
      {...props}
      dataSlot="command-separator"
      className={`bg-border -mx-1 h-px ${props.className->Option.getOr("")}`}
    />
}

module Item = {
  @react.componentWithProps
  let make = (props: primitiveProps) =>
    <CommandPrimitive.Item.make
      {...props}
      dataSlot="command-item"
      className={`data-selected:bg-muted data-selected:text-foreground data-selected:*:[svg]:text-foreground group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
      <Icons.check className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item.make>
}

module Shortcut = {
  @react.componentWithProps
  let make = (props: primitiveProps) => {
    let props = {...props, dataSlot: "command-shortcut"}
    <span
      {...toDomProps(props)}
      className={`text-muted-foreground group-data-selected/command-item:text-foreground ml-auto text-xs tracking-widest ${props.className->Option.getOr("")}`}
    />
  }
}
