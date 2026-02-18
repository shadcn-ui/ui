@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

open BaseUi.Types

let badgeVariantClass = (~variant: Variant.t) =>
  switch variant {
  | Secondary => "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80"
  | Destructive => "bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20"
  | Outline => "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground"
  | Ghost => "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50"
  | Link => "text-primary underline-offset-4 hover:underline"
  | Default
  | Muted
  | Line
  | Icon
  | Image
  | Legend
  | Label => "bg-primary text-primary-foreground [a]:hover:bg-primary/80"
  }

let badgeVariants = (~variant=Variant.Default) => {
  let base = "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive overflow-hidden group/badge"
  `${base} ${badgeVariantClass(~variant)}`
}

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~onKeyDownCapture=?,
  ~style=?,
  ~dataVariant=Variant.Default,
) => {
  let variant = dataVariant
  <span
    ?id
    ?children
    ?onClick
    ?onKeyDown
    ?onKeyDownCapture
    ?style
    dataSlot="badge"
    dataVariant={variant}
    className={`${badgeVariants(~variant)} ${className}`}
  />
}
