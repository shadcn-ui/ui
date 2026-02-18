@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

open BaseUi.Types

let inputGroupAddonAlignClass = (~align: DataAlign.t) =>
  switch align {
  | InlineEnd => "pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem] order-last"
  | BlockStart => "px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2 order-first w-full justify-start"
  | BlockEnd => "px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2 order-last w-full justify-start"
  | InlineStart => "pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem] order-first"
  }

let inputGroupAddonVariants = (~align=DataAlign.InlineStart) => {
  let base = "text-muted-foreground h-auto gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4 flex cursor-text items-center justify-center select-none"
  `${base} ${inputGroupAddonAlignClass(~align)}`
}

let inputGroupButtonSizeClass = (~size: Size.t) =>
  switch size {
  | Sm => ""
  | IconXs => "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0"
  | IconSm => "size-8 p-0 has-[>svg]:p-0"
  | Default
  | Xs
  | Md
  | Lg
  | Icon
  | IconLg => "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5"
  }

let inputGroupButtonVariants = (~size=Size.Xs) => {
  let base = "gap-2 text-sm shadow-none flex items-center"
  `${base} ${inputGroupButtonSizeClass(~size)}`
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
  ~disabled=?,
  ~dataDisabled=?,
) => {
  <div
    ?id
    ?children
    ?style
    ?onClick
    ?onKeyDown
    ?onKeyDownCapture
    ?disabled
    ?dataDisabled
    dataSlot="input-group"
    role="group"
    className={`border-input dark:bg-input/30 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-disabled:bg-input/50 dark:has-disabled:bg-input/80 group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-3 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5 ${className}`}
  />
}

module Addon = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~dataAlign=DataAlign.InlineStart,
  ) => {
    let align = dataAlign
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="input-group-addon"
      dataAlign={align}
      role="group"
      className={`${inputGroupAddonVariants(~align)} ${className}`}
    />
  }
}

module Button = {
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
    ~type_="button",
    ~dataSize=Size.Xs,
    ~dataVariant=Variant.Ghost,
  ) => {
    let size = dataSize
    let variant = dataVariant
    <BaseUi.Button
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?disabled
      type_
      dataSize={size}
      dataVariant={variant}
      className={`${inputGroupButtonVariants(~size)} ${className}`}
    />
  }
}

module Text = {
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
    <span
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      className={`text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 ${className}`}
    />
}

module Input = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~name=?,
    ~placeholder=?,
    ~value=?,
    ~defaultValue=?,
    ~onValueChange=?,
    ~disabled=?,
    ~readOnly=?,
    ~required=?,
    ~type_=?,
    ~maxLength=?,
    ~spellCheck=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~ariaLabel=?,
    ~ariaRoledescription=?,
  ) =>
    <BaseUi.Input
      ?id
      ?name
      ?placeholder
      ?value
      ?defaultValue
      ?onValueChange
      ?disabled
      ?readOnly
      ?required
      ?type_
      ?maxLength
      ?spellCheck
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?ariaLabel
      ?ariaRoledescription
      ?children
      dataSlot="input-group-control"
      className={`dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 file:text-foreground placeholder:text-muted-foreground h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent ${className}`}
    />
}

module Textarea = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~name=?,
    ~placeholder=?,
    ~value=?,
    ~defaultValue=?,
    ~disabled=?,
    ~readOnly=?,
    ~required=?,
    ~maxLength=?,
    ~spellCheck=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <textarea
      ?id
      ?children
      ?style
      ?name
      ?placeholder
      ?value
      ?defaultValue
      ?disabled
      ?readOnly
      ?required
      ?maxLength
      ?spellCheck
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="input-group-control"
      className={`border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent ${className}`}
    />
}
