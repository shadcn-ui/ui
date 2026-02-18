@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

open BaseUi.Types

@react.component
let make = (~children=?, ~open_=?, ~defaultOpen=?, ~onOpenChange=?, ~onOpenChangeComplete=?) =>
  <BaseUi.AlertDialog.Root
    ?children ?open_ ?defaultOpen ?onOpenChange ?onOpenChangeComplete dataSlot="alert-dialog"
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
    <BaseUi.AlertDialog.Trigger
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
      dataSlot="alert-dialog-trigger"
      className
    />
}

module Portal = {
  @react.component
  let make = (~children=?, ~container=?) =>
    <BaseUi.AlertDialog.Portal ?children ?container dataSlot="alert-dialog-portal" />
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
    <BaseUi.AlertDialog.Backdrop
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?keepMounted
      dataSlot="alert-dialog-overlay"
      className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs ${className}`}
    />
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
    ~onKeyDownCapture=?,
    ~keepMounted=?,
    ~dataSize=Size.Default,
  ) => {
    let size = dataSize
    <Portal>
      <Overlay />
      <BaseUi.AlertDialog.Popup
        ?id
        ?style
        ?onClick
        ?onKeyDown
        ?onKeyDownCapture
        ?keepMounted
        ?children
        dataSlot="alert-dialog-content"
        dataSize={size}
        className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 bg-background ring-foreground/10 group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-4 ring-1 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm ${className}`}
      />
    </Portal>
  }
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
      dataSlot="alert-dialog-header"
      className={`grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr] ${className}`}
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
      dataSlot="alert-dialog-footer"
      className={`bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end ${className}`}
    />
}

module Media = {
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
      dataSlot="alert-dialog-media"
      className={`bg-muted mb-2 inline-flex size-10 items-center justify-center rounded-md sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6 ${className}`}
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
    <BaseUi.AlertDialog.Title
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?children
      dataSlot="alert-dialog-title"
      className={`text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2 ${className}`}
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
    <BaseUi.AlertDialog.Description
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?children
      dataSlot="alert-dialog-description"
      className={`text-muted-foreground *:[a]:hover:text-foreground text-sm text-balance md:text-pretty *:[a]:underline *:[a]:underline-offset-3 ${className}`}
    />
}

module Action = {
  @react.component
  let make = (
    ~className="",
    ~variant=Variant.Default,
    ~size=Size.Default,
    ~nativeButton=?,
    ~disabled=?,
    ~children=?,
    ~onClick=?,
    ~type_=?,
    ~ariaLabel=?,
    ~render=?,
  ) =>
    <Button
      className
      variant
      size
      ?nativeButton
      ?disabled
      ?children
      ?onClick
      ?type_
      ?ariaLabel
      ?render
      dataSlot="alert-dialog-action"
    />
}

module Cancel = {
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
    ~dataVariant=Variant.Outline,
    ~dataSize=Size.Default,
  ) => {
    let variant = dataVariant
    let size = dataSize
    <BaseUi.AlertDialog.Close
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?disabled
      ?nativeButton
      ?type_
      ?ariaLabel
      ?children
      dataSlot="alert-dialog-cancel"
      render={switch render {
      | Some(value) => value
      | None => <Button variant size className />
      }}
    />
  }
}
