
open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) =>
  <BaseUi.Dialog.Root {...props} dataSlot="sheet" />

module Trigger = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Dialog.Trigger {...props} dataSlot="sheet-trigger" />
}

module Close = {
  @react.componentWithProps
  let make = (props: propsWithOptionalChildren<'value, 'checked>) =>
    <BaseUi.Dialog.Close {...props} dataSlot="sheet-close" />
}

module Portal = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Dialog.Portal {...props} dataSlot="sheet-portal" />
}

module Overlay = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Dialog.Backdrop
      {...props}
      dataSlot="sheet-overlay"
      className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 z-50 bg-black/10 duration-100 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs ${props.className->Option.getOr("")}`}
    />
}

let sideToString = (side: Side.t) =>
  switch side {
  | Top => "top"
  | Bottom => "bottom"
  | Left => "left"
  | Right
  | InlineStart
  | InlineEnd => "right"
  }

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let side = props.side->Option.getOr(Side.Right)
    let showCloseButton = props.showCloseButton->Option.getOr(true)
    <Portal>
      <Overlay />
      <BaseUi.Dialog.Popup
        dataSlot="sheet-content"
        dataSide={sideToString(side)}
        className={`bg-background data-open:animate-in data-closed:animate-out data-[side=right]:data-closed:slide-out-to-right-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=top]:data-closed:slide-out-to-top-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:fade-out-0 data-open:fade-in-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=bottom]:data-open:slide-in-from-bottom-10 fixed z-50 flex flex-col gap-4 bg-clip-padding text-sm shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm ${props.className->Option.getOr("")}`}
      >
        {props.children}
        {showCloseButton
          ? <BaseUi.Dialog.Close
              dataSlot="sheet-close"
              render={
                <Button
                  dataVariant=Ghost
                  dataSize=IconSm
                  className="absolute top-3 right-3"
                />
              }
            >
              <Icons.X />
              <span className="sr-only">{"Close"->React.string}</span>
            </BaseUi.Dialog.Close>
          : React.null}
      </BaseUi.Dialog.Popup>
    </Portal>
  }
}

module Header = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sheet-header"}
    <div
      {...toDomProps(props)}
      className={`flex flex-col gap-0.5 p-4 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
  }
}

module Footer = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sheet-footer"}
    <div
      {...toDomProps(props)}
      className={`mt-auto flex flex-col gap-2 p-4 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
  }
}

module Title = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Dialog.Title
      {...props}
      dataSlot="sheet-title"
      className={`text-foreground text-base font-medium ${props.className->Option.getOr("")}`}
    />
}

module Description = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Dialog.Description
      {...props}
      dataSlot="sheet-description"
      className={`text-muted-foreground text-sm ${props.className->Option.getOr("")}`}
    />
}
