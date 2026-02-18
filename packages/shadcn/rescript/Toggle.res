@@directive("'use client'")

open BaseUi.Types

let toggleVariantClass = (~variant: Variant.t) =>
  switch variant {
  | Outline => "border-input hover:bg-muted border bg-transparent"
  | Default
  | Secondary
  | Destructive
  | Ghost
  | Muted
  | Line
  | Link
  | Icon
  | Image
  | Legend
  | Label => "bg-transparent"
  }

let toggleSizeClass = (~size: Size.t) =>
  switch size {
  | Sm => "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-1.5 text-[0.8rem]"
  | Lg => "h-9 min-w-9 px-2.5"
  | Default
  | Xs
  | Md
  | Icon
  | IconXs
  | IconSm
  | IconLg => "h-8 min-w-8 px-2"
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
  ~onKeyDownCapture=?,
  ~tabIndex=?,
  ~ariaLabel=?,
  ~type_=?,
  ~render=?,
  ~dataVariant=Variant.Default,
  ~dataSize=Size.Default,
) => {
  let variant = dataVariant
  let size = dataSize
  <BaseUi.Toggle
    ?id
    ?name
    ?disabled
    ?checked
    ?defaultChecked
    ?onCheckedChange
    ?onClick
    ?onKeyDown
    ?onKeyDownCapture
    ?tabIndex
    ?ariaLabel
    ?type_
    ?render
    ?children
    dataSlot="toggle"
    className={`${toggleVariants(~variant, ~size)} ${className}`}
  />
}
