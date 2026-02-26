@@directive("'use client'")

module Variant = {
  @unboxed
  type t =
    | @as("default") Default
    | @as("outline") Outline
}

module Size = {
  @unboxed
  type t =
    | @as("default") Default
    | @as("sm") Sm
    | @as("lg") Lg
}

let toggleVariantClass = (~variant: Variant.t) =>
  switch variant {
  | Outline => "border-input hover:bg-muted border bg-transparent"
  | Default => "bg-transparent"
  }

let toggleSizeClass = (~size: Size.t) =>
  switch size {
  | Sm => "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-1.5 text-[0.8rem]"
  | Lg => "h-9 min-w-9 px-2.5"
  | Default => "h-8 min-w-8 px-2"
  }

let toggleVariants = (~variant=Variant.Default, ~size=Size.Default) => {
  let base = "hover:text-foreground aria-pressed:bg-muted focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[state=on]:bg-muted gap-1 rounded-lg text-sm font-medium transition-all [&_svg:not([class*='size-'])]:size-4 group/toggle hover:bg-muted inline-flex items-center justify-center whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0"
  `${base} ${toggleVariantClass(~variant)} ${toggleSizeClass(~size)}`
}

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~name=?,
  ~disabled=?,
  ~checked=?,
  ~defaultChecked=?,
  ~onCheckedChange=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~tabIndex=0,
  ~ariaLabel=?,
  ~type_=?,
  ~render=?,
  ~variant=?,
  ~dataVariant=?,
  ~size=?,
  ~dataSize=?,
) => {
  let variant = switch (variant, dataVariant) {
  | (Some(variant), _) => variant
  | (None, Some(variant)) => variant
  | (None, None) => Variant.Default
  }
  let size = switch (size, dataSize) {
  | (Some(size), _) => size
  | (None, Some(size)) => size
  | (None, None) => Size.Default
  }
  let _ignoredOnCheckedChange = onCheckedChange
  let resolvedClassName = if className == "" {
    toggleVariants(~variant, ~size)
  } else {
    `${toggleVariants(~variant, ~size)} ${className}`
  }
  <BaseUi.Toggle
    ?id
    ?name
    ?disabled
    ?checked
    ?defaultChecked
    ?onClick
    ?onKeyDown
    tabIndex
    ?ariaLabel
    ?type_
    ?render
    ?children
    dataSlot="toggle"
    className={resolvedClassName}
  />
}
