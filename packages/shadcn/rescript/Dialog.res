@@directive("'use client'")

open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) =>
  <BaseUi.Dialog.Root {...props} dataSlot="dialog" />

module Trigger = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Dialog.Trigger {...props} dataSlot="dialog-trigger" />
}

module Portal = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Dialog.Portal {...props} dataSlot="dialog-portal" />
}

module Close = {
  @react.componentWithProps
  let make = (props: propsWithOptionalChildren<'value, 'checked>) =>
    <BaseUi.Dialog.Close {...props} dataSlot="dialog-close" />
}

module Overlay = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Dialog.Backdrop
      {...props}
      dataSlot="dialog-overlay"
      className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs ${props.className->Option.getOr("")}`}
    />
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let showCloseButton = props.showCloseButton->Option.getOr(true)
    <Portal>
      <Overlay />
      <BaseUi.Dialog.Popup
        {...props}
        dataSlot="dialog-content"
        className={`bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/10 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-4 text-sm ring-1 duration-100 outline-none sm:max-w-sm ${props.className->Option.getOr("")}`}
      >
        {props.children}
        {showCloseButton
          ? <BaseUi.Dialog.Close
              dataSlot="dialog-close"
              render={
                <Button
                  dataVariant=Ghost
                  dataSize=IconSm
                  className="absolute top-2 right-2"
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
    let props = {...props, dataSlot: "dialog-header"}
    <div
      {...toDomProps(props)}
      className={`flex flex-col gap-2 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
  }
}

module Footer = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "dialog-footer"}
    <div
      {...toDomProps(props)}
      className={`bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-end ${props.className->Option.getOr("")}`}
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
      dataSlot="dialog-title"
      className={`text-base leading-none font-medium ${props.className->Option.getOr("")}`}
    />
}

module Description = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Dialog.Description
      {...props}
      dataSlot="dialog-description"
      className={`text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3 ${props.className->Option.getOr("")}`}
    />
}
