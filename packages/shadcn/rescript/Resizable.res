type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>
type primitiveProps = props<string, bool>

module ResizablePrimitive = {
  @module("react-resizable-panels")
  external group: React.component<primitiveProps> = "Group"

  @module("react-resizable-panels")
  external panel: React.component<primitiveProps> = "Panel"

  @module("react-resizable-panels")
  external separator: React.component<primitiveProps> = "Separator"
}

@react.componentWithProps
let make = (props: primitiveProps) =>
  <ResizablePrimitive.group
    {...props}
    dataSlot="resizable-panel-group"
    className={`flex h-full w-full aria-[orientation=vertical]:flex-col ${props.className->Option.getOr("")}`}
  />

module Panel = {
  @react.componentWithProps
  let make = (props: primitiveProps) =>
    <ResizablePrimitive.panel {...props} dataSlot="resizable-panel" />
}

module Handle = {
  @react.componentWithProps
  let make = (props: primitiveProps) => {
    let withHandle = props.withHandle->Option.getOr(false)
    <ResizablePrimitive.separator
      {...props}
      dataSlot="resizable-handle"
      className={`bg-border focus-visible:ring-ring ring-offset-background relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90 ${props.className->Option.getOr("")}`}
    >
      {
        if withHandle {
          <div className="bg-border z-10 flex h-6 w-1 shrink-0 rounded-lg" />
        } else {
          React.null
        }
      }
    </ResizablePrimitive.separator>
  }
}
