@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

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
  <BaseUi.Dialog.Root
    ?children ?open_ ?defaultOpen ?onOpenChange ?onOpenChangeComplete ?modal dataSlot="dialog"
  />

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
    <BaseUi.Dialog.Trigger
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
      dataSlot="dialog-trigger"
      className
    />
}

module Portal = {
  @react.component
  let make = (~children=?, ~container=?) =>
    <BaseUi.Dialog.Portal ?children ?container dataSlot="dialog-portal" />
}

module Close = {
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
    <BaseUi.Dialog.Close
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
      dataSlot="dialog-close"
      className
    />
}

module Overlay = {
  @react.component
  let make = (
    ~className="",
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~keepMounted=?,
  ) =>
    <BaseUi.Dialog.Backdrop
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?keepMounted
      dataSlot="dialog-overlay"
      className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs ${className}`}
    />
}

module Content = {
  @react.component
  let make = (
    ~className="",
    ~children=React.null,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~showCloseButton=true,
    ~keepMounted=?,
  ) =>
    <Portal>
      <Overlay />
      <BaseUi.Dialog.Popup
        ?id
        ?style
        ?onClick
        ?onKeyDown
        ?onKeyDownCapture
        ?keepMounted
        dataSlot="dialog-content"
        className={`bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/10 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-4 text-sm ring-1 duration-100 outline-none sm:max-w-sm ${className}`}
      >
        {children}
        {showCloseButton
          ? <BaseUi.Dialog.Close
              dataSlot="dialog-close"
              render={<Button variant=Ghost size=IconSm className="absolute top-2 right-2" />}
            >
              <Icons.X />
              <span className="sr-only"> {"Close"->React.string} </span>
            </BaseUi.Dialog.Close>
          : React.null}
      </BaseUi.Dialog.Popup>
    </Portal>
}

module Header = {
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
    <div
      ?id
      ?style
      ?children
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="dialog-header"
      className={`flex flex-col gap-2 ${className}`}
    />
}

module Footer = {
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
    <div
      ?id
      ?style
      ?children
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="dialog-footer"
      className={`bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-end ${className}`}
    />
}

module Title = {
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
    <BaseUi.Dialog.Title
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?children
      dataSlot="dialog-title"
      className={`text-base leading-none font-medium ${className}`}
    />
}

module Description = {
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
    <BaseUi.Dialog.Description
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?children
      dataSlot="dialog-description"
      className={`text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3 ${className}`}
    />
}
