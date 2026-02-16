open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

module DrawerPrimitive = {
  @module("vaul")
  @scope("Drawer")
  external root: React.component<props<string, bool>> = "Root"

  @module("vaul")
  @scope("Drawer")
  external trigger: React.component<props<string, bool>> = "Trigger"

  @module("vaul")
  @scope("Drawer")
  external portal: React.component<propsWithChildren<string, bool>> = "Portal"

  @module("vaul")
  @scope("Drawer")
  external close: React.component<props<string, bool>> = "Close"

  @module("vaul")
  @scope("Drawer")
  external overlay: React.component<props<string, bool>> = "Overlay"

  @module("vaul")
  @scope("Drawer")
  external content: React.component<propsWithChildren<string, bool>> = "Content"

  @module("vaul")
  @scope("Drawer")
  external title: React.component<props<string, bool>> = "Title"

  @module("vaul")
  @scope("Drawer")
  external description: React.component<props<string, bool>> = "Description"
}

@react.componentWithProps
let make = (props: props<string, bool>) => <DrawerPrimitive.root {...props} dataSlot="drawer" />

module Trigger = {
  @react.componentWithProps
  let make = (props: props<string, bool>) =>
    <DrawerPrimitive.trigger {...props} dataSlot="drawer-trigger" />
}

module Portal = {
  @react.componentWithProps
  let make = (props: propsWithChildren<string, bool>) =>
    <DrawerPrimitive.portal {...props} dataSlot="drawer-portal" />
}

module Close = {
  @react.componentWithProps
  let make = (props: props<string, bool>) =>
    <DrawerPrimitive.close {...props} dataSlot="drawer-close" />
}

module Overlay = {
  @react.componentWithProps
  let make = (props: props<string, bool>) =>
    <DrawerPrimitive.overlay
      {...props}
      dataSlot="drawer-overlay"
      className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs ${props.className->Option.getOr("")}`}
    />
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<string, bool>) =>
    <Portal dataSlot="drawer-portal">
      <Overlay />
      <DrawerPrimitive.content
        {...props}
        dataSlot="drawer-content"
        className={`bg-background group/drawer-content fixed z-50 flex h-auto flex-col text-sm data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm ${props.className->Option.getOr("")}`}
      >
        <div className="bg-muted mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {props.children}
      </DrawerPrimitive.content>
    </Portal>
}

module Header = {
  @react.componentWithProps
  let make = (props: props<string, bool>) => {
    let props = {...props, dataSlot: "drawer-header"}
    <div
      {...toDomProps(props)}
      className={`flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-left ${props.className->Option.getOr("")}`}
    />
  }
}

module Footer = {
  @react.componentWithProps
  let make = (props: props<string, bool>) => {
    let props = {...props, dataSlot: "drawer-footer"}
    <div
      {...toDomProps(props)}
      className={`mt-auto flex flex-col gap-2 p-4 ${props.className->Option.getOr("")}`}
    />
  }
}

module Title = {
  @react.componentWithProps
  let make = (props: props<string, bool>) =>
    <DrawerPrimitive.title
      {...props}
      dataSlot="drawer-title"
      className={`text-foreground text-base font-medium ${props.className->Option.getOr("")}`}
    />
}

module Description = {
  @react.componentWithProps
  let make = (props: props<string, bool>) =>
    <DrawerPrimitive.description
      {...props}
      dataSlot="drawer-description"
      className={`text-muted-foreground text-sm ${props.className->Option.getOr("")}`}
    />
}
