@@directive("'use client'")

open BaseUi.Types

let buttonVariantClass = (~variant: Variant.t) =>
  switch variant {
  | Outline => "border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground"
  | Secondary => "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground"
  | Ghost => "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground"
  | Destructive => "bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30"
  | Link => "text-primary underline-offset-4 hover:underline"
  | Default
  | Muted
  | Line
  | Icon
  | Image
  | Legend
  | Label => "bg-primary text-primary-foreground [a]:hover:bg-primary/80"
  }

let buttonSizeClass = (~size: Size.t) =>
  switch size {
  | Xs => "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3"
  | Sm => "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5"
  | Lg => "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3"
  | Icon => "size-8"
  | IconXs => "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3"
  | IconSm => "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg"
  | IconLg => "size-9"
  | Default
  | Md => "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2"
  }

let buttonVariants = (~variant=Variant.Default, ~size=Size.Default) => {
  let base = "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none"
  let radiusClass = switch size {
  | Xs
  | Sm
  | IconXs
  | IconSm => ""
  | Default
  | Md
  | Lg
  | Icon
  | IconLg => "rounded-lg"
  }
  `${base} ${radiusClass} ${buttonVariantClass(~variant)} ${buttonSizeClass(~size)}`
}

@react.component
let make = (
  ~className="",
  ~variant=Variant.Default,
  ~size=Size.Default,
  ~nativeButton=?,
  ~disabled=?,
  ~style=?,
  ~children=?,
  ~onClick=?,
  ~type_=?,
  ~ariaLabel=?,
  ~ariaDisabled=?,
  ~dataSidebar=?,
  ~render=?,
  ~dataSlot="button",
) => {
  <BaseUi.Button
    dataSlot
    className={`${buttonVariants(~variant, ~size)} ${className}`}
    ?nativeButton
    ?disabled
    ?style
    ?children
    ?onClick
    type_=?{switch (type_, nativeButton, render) {
    | (None, None, None) => Some("button")
    | _ => type_
    }}
    ?ariaLabel
    ?ariaDisabled
    ?dataSidebar
    ?render
  />
}
